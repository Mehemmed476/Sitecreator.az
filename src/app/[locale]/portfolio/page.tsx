import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/lib/models/Portfolio";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, page: "portfolio", pathname: "/portfolio" });
}

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations("portfolio");

  let projects: Array<{
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    techStack: string[];
    projectUrl?: string;
  }> = [];

  try {
    await connectDB();
    const raw = await Portfolio.find().sort({ createdAt: -1 }).lean();
    projects = raw.map((p) => ({
      _id: String(p._id),
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      techStack: p.techStack,
      projectUrl: p.projectUrl,
    }));
  } catch {
    // DB not available — show empty state
  }

  return <PortfolioContent projects={projects} />;
}

function PortfolioContent({
  projects,
}: {
  projects: Array<{
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    techStack: string[];
    projectUrl?: string;
  }>;
}) {
  const t = useTranslations("portfolio");

  return (
    <section className="site-section py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="site-card-soft mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl">
              <ExternalLink className="w-8 h-8 text-muted" />
            </div>
            <p className="text-muted text-lg">{t("noProjects")}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="site-card group overflow-hidden rounded-2xl
                  transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-surface">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted mb-2">
                      {t("techStack")}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-full bg-primary/5
                            px-2.5 py-0.5 text-xs font-medium text-primary
                            border border-primary/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Link */}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium
                        text-primary hover:text-primary-hover transition-colors"
                    >
                      {t("viewProject")}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
