import { connectDB } from "@/lib/db";
import {
  defaultPackageSolutionsConfig,
  getLocalizedPackageContent,
  sanitizePackageSolutionsConfig,
  type PackageLocale,
  type PackageSolutionRecord,
  type PackageSolutionsConfig,
} from "@/lib/package-solutions";
import { PackageSolutionsConfigModel } from "@/lib/models/PackageSolutionsConfig";

async function ensurePackageSolutionsConfig() {
  await connectDB();

  const existing = await PackageSolutionsConfigModel.findOne({ singletonKey: "main" }).lean();
  if (existing?.config) {
    return sanitizePackageSolutionsConfig(existing.config);
  }

  const created = await PackageSolutionsConfigModel.create({
    singletonKey: "main",
    config: defaultPackageSolutionsConfig,
  });

  return sanitizePackageSolutionsConfig(created.toObject().config);
}

export async function getPackageSolutionsConfig(): Promise<PackageSolutionsConfig> {
  return ensurePackageSolutionsConfig();
}

export async function savePackageSolutionsConfig(config: unknown): Promise<PackageSolutionsConfig> {
  const nextConfig = sanitizePackageSolutionsConfig(config);
  await connectDB();

  await PackageSolutionsConfigModel.findOneAndUpdate(
    { singletonKey: "main" },
    { singletonKey: "main", config: nextConfig },
    { upsert: true, returnDocument: "after" }
  );

  return nextConfig;
}

export async function getAllPackageSolutions() {
  const config = await getPackageSolutionsConfig();
  return config.packages;
}

export async function getPackageSolutionBySlug(slug: string, locale: PackageLocale) {
  const packages = await getAllPackageSolutions();
  return (
    packages.find((item) => item.slugs[locale] === slug) ??
    packages.find((item) => Object.values(item.slugs).includes(slug)) ??
    null
  );
}

export async function getPackageSolutionById(id: string) {
  const packages = await getAllPackageSolutions();
  return packages.find((item) => item.id === id) ?? null;
}

export async function getAllPackageSlugs() {
  const packages = await getAllPackageSolutions();
  return packages.map((item) => ({
    id: item.id,
    slugs: item.slugs,
    updatedAt: new Date(),
  }));
}

export type PackageListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  startingPrice: number;
};

export function mapPackageListItem(item: PackageSolutionRecord, locale: PackageLocale): PackageListItem {
  const content = getLocalizedPackageContent(item, locale);
  return {
    id: item.id,
    slug: item.slugs[locale],
    title: content.cardTitle,
    description: content.cardDescription,
    coverImageUrl: item.coverImageUrl,
    startingPrice: item.startingPrice,
  };
}
