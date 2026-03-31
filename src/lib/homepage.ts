import { connectDB } from "@/lib/db";
import {
  defaultHomepageContent,
  sanitizeHomepageContent,
  type HomepageContent,
} from "@/lib/homepage-content";
import { HomepageContentModel } from "@/lib/models/HomepageContent";
import { HomepageFeatured } from "@/lib/models/HomepageFeatured";
import { Portfolio } from "@/lib/models/Portfolio";
import {
  getPortfolioTranslation,
  normalizePortfolioTranslations,
  type PortfolioLocale,
} from "@/lib/portfolio-types";

export type PortfolioLite = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  projectUrl?: string;
};

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    await connectDB();

    const existing = await HomepageContentModel.findOne({ singletonKey: "main" }).lean();

    if (existing?.content) {
      return sanitizeHomepageContent(existing.content);
    }

    const created = await HomepageContentModel.create({
      singletonKey: "main",
      content: defaultHomepageContent,
    });

    return sanitizeHomepageContent(created.toObject().content);
  } catch {
    return defaultHomepageContent;
  }
}

export async function getHomepageFeaturedProjects(
  locale: PortfolioLocale,
  limit = 3
): Promise<PortfolioLite[]> {
  try {
    await connectDB();

    const featuredDoc = await HomepageFeatured.findOne().lean();
    const projectIds = featuredDoc?.projectIds ?? [];

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return [];
    }

    const raws = await Portfolio.find({ _id: { $in: projectIds } }).lean();
    const byId = new Map<string, PortfolioLite>();

    for (const project of raws) {
      const id = String(project._id);
      const translations = normalizePortfolioTranslations(project.translations, {
        defaultDescription: typeof project.description === "string" ? project.description : "",
        defaultProjectUrl: typeof project.projectUrl === "string" ? project.projectUrl : "",
      });
      const localized = getPortfolioTranslation({ translations }, locale);
      byId.set(id, {
        _id: id,
        title: String(project.title ?? ""),
        description: localized.description,
        imageUrl: String(project.imageUrl ?? ""),
        techStack: Array.isArray(project.techStack) ? project.techStack.map(String) : [],
        projectUrl: localized.projectUrl,
      });
    }

    return projectIds
      .slice(0, limit)
      .map((id) => byId.get(String(id)))
      .filter((project): project is PortfolioLite => Boolean(project));
  } catch {
    return [];
  }
}
