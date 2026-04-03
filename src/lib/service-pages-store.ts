import { connectDB } from "@/lib/db";
import {
  defaultServicePagesConfig,
  getLocalizedServiceContent,
  sanitizeServicePagesConfig,
  type ServiceLocale,
  type ServicePageRecord,
  type ServicePagesConfig,
} from "@/lib/service-pages";
import { ServicePagesConfigModel } from "@/lib/models/ServicePagesConfig";

async function ensureServicePagesConfig() {
  await connectDB();

  const existing = await ServicePagesConfigModel.findOne({ singletonKey: "main" }).lean();
  if (existing?.config) {
    return sanitizeServicePagesConfig(existing.config);
  }

  const created = await ServicePagesConfigModel.create({
    singletonKey: "main",
    config: defaultServicePagesConfig,
  });

  return sanitizeServicePagesConfig(created.toObject().config);
}

export async function getServicePagesConfig(): Promise<ServicePagesConfig> {
  return ensureServicePagesConfig();
}

export async function saveServicePagesConfig(config: unknown): Promise<ServicePagesConfig> {
  const nextConfig = sanitizeServicePagesConfig(config);
  await connectDB();

  await ServicePagesConfigModel.findOneAndUpdate(
    { singletonKey: "main" },
    { singletonKey: "main", config: nextConfig },
    { upsert: true, returnDocument: "after" }
  );

  return nextConfig;
}

export async function getAllServicePages() {
  const config = await getServicePagesConfig();
  return config.services;
}

export async function getServicePageBySlug(slug: string, locale: ServiceLocale) {
  const services = await getAllServicePages();
  return (
    services.find((service) => service.slugs[locale] === slug) ??
    services.find((service) => Object.values(service.slugs).includes(slug)) ??
    null
  );
}

export async function getAllServiceSlugs() {
  const services = await getAllServicePages();
  return services.map((service) => ({
    id: service.id,
    slugs: service.slugs,
    updatedAt: new Date(),
  }));
}

export type ServiceListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

export function mapServiceListItem(service: ServicePageRecord, locale: ServiceLocale): ServiceListItem {
  const content = getLocalizedServiceContent(service, locale);

  return {
    id: service.id,
    slug: service.slugs[locale],
    title: content.cardTitle,
    description: content.cardDescription,
  };
}
