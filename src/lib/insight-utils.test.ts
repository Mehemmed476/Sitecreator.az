import assert from "node:assert/strict";
import test from "node:test";
import {
  estimateReadingTime,
  getInsightCoverImage,
  normalizeInsightTags,
  slugifyInsight,
  splitInsightContentIntoBlocks,
} from "./insight-utils.ts";

test("slugifyInsight creates a clean URL-safe slug", () => {
  assert.equal(slugifyInsight("  SEO & Web Design in Baku  "), "seo-web-design-in-baku");
});

test("slugifyInsight transliterates Azerbaijani and Russian characters", () => {
  assert.equal(slugifyInsight("Böyümə üçün veb-sayt"), "boyume-ucun-veb-sayt");
  assert.equal(slugifyInsight("Разработка сайта в Баку"), "razrabotka-saita-v-baku");
});

test("normalizeInsightTags trims and removes empty tags", () => {
  assert.deepEqual(normalizeInsightTags("seo, web design, , case study "), [
    "seo",
    "web design",
    "case study",
  ]);
});

test("splitInsightContentIntoBlocks detects headings, lists and paragraphs", () => {
  const blocks = splitInsightContentIntoBlocks(
    "## Results\n\n- Faster load time\n- Better leads\n\nThis is a summary paragraph."
  );

  assert.deepEqual(blocks, [
    { type: "heading", content: "Results" },
    { type: "list", items: ["Faster load time", "Better leads"] },
    { type: "paragraph", content: "This is a summary paragraph." },
  ]);
});

test("estimateReadingTime never returns less than one minute", () => {
  assert.equal(estimateReadingTime("short copy"), 1);
});

test("getInsightCoverImage prefers locale-specific cover and falls back safely", () => {
  const insight = {
    _id: "1",
    type: "blog" as const,
    coverImageUrl: "https://example.com/shared.jpg",
    translations: {
      az: {
        title: "AZ title",
        slug: "az-title",
        excerpt: "AZ excerpt",
        content: "AZ content",
        tags: [],
        coverImageUrl: "https://example.com/az.jpg",
        coverImagePublicId: "",
        seoTitle: "",
        seoDescription: "",
      },
      en: {
        title: "EN title",
        slug: "en-title",
        excerpt: "EN excerpt",
        content: "EN content",
        tags: [],
        coverImageUrl: "",
        coverImagePublicId: "",
        seoTitle: "",
        seoDescription: "",
      },
      ru: {
        title: "RU title",
        slug: "ru-title",
        excerpt: "RU excerpt",
        content: "RU content",
        tags: [],
        coverImageUrl: "https://example.com/ru.jpg",
        coverImagePublicId: "",
        seoTitle: "",
        seoDescription: "",
      },
    },
    published: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assert.equal(getInsightCoverImage(insight, "az"), "https://example.com/az.jpg");
  assert.equal(getInsightCoverImage(insight, "en"), "https://example.com/az.jpg");
});
