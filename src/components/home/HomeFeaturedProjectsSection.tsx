import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import type { PortfolioLite } from "@/lib/homepage";

export function HomeFeaturedProjectsSection({
  title,
  emptyState,
  projects,
}: {
  title: string;
  emptyState: string;
  projects: PortfolioLite[];
}) {
  const t = useTranslations();

  return (
    <section className="site-section site-section-alt py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeading title={title} />

        {projects.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted">{emptyState}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="site-card group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="relative aspect-video overflow-hidden bg-surface">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>

                  {project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                      {t("portfolio.viewProject")}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
