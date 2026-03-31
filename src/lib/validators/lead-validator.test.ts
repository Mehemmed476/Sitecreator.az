import test from "node:test";
import assert from "node:assert/strict";
import { createLeadInputSchema, updateLeadInputSchema } from "./lead-validator.ts";

test("createLeadInputSchema parses calculator leads safely", () => {
  const parsed = createLeadInputSchema.parse({
    name: "Test User",
    email: "TEST@Example.com",
    phone: "+994501112233",
    company: "Sitecreator",
    message: "Salam",
    source: "calculator",
    calculator: {
      locale: "az",
      total: 1200,
      buildLabels: ["Elaqe formasi"],
      lineItems: [{ label: "Website", amount: 1200 }],
      selections: { serviceId: "website" },
    },
  });

  assert.equal(parsed.source, "calculator");
  assert.equal(parsed.calculator?.total, 1200);
  assert.deepEqual(parsed.calculator?.buildLabels, ["Elaqe formasi"]);
});

test("updateLeadInputSchema accepts nullable follow-up values", () => {
  const parsed = updateLeadInputSchema.parse({
    status: "contacted",
    notes: "Zeng edildi",
    nextFollowUpAt: null,
    isRead: true,
  });

  assert.equal(parsed.status, "contacted");
  assert.equal(parsed.nextFollowUpAt, null);
  assert.equal(parsed.isRead, true);
});
