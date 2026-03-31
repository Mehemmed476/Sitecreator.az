import test from "node:test";
import assert from "node:assert/strict";
import { updateProjectInputSchema } from "./project-validator.ts";
import { updateProposalInputSchema } from "./proposal-validator.ts";

test("updateProjectInputSchema trims milestone labels and keeps valid statuses", () => {
  const parsed = updateProjectInputSchema.parse({
    title: " Yeni sayt ",
    status: "in_progress",
    milestones: [{ label: " Dizayn ", done: true }],
  });

  assert.equal(parsed.title, "Yeni sayt");
  assert.equal(parsed.status, "in_progress");
  assert.equal(parsed.milestones?.[0]?.label, "Dizayn");
});

test("updateProposalInputSchema normalizes line items", () => {
  const parsed = updateProposalInputSchema.parse({
    title: " Teklif ",
    status: "sent",
    lineItems: [{ label: " Website ", amount: 1450 }],
  });

  assert.equal(parsed.title, "Teklif");
  assert.equal(parsed.status, "sent");
  assert.equal(parsed.lineItems?.[0]?.label, "Website");
});
