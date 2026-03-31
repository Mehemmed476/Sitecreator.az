import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Target, Eye, Users, FolderKanban, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, page: "about", pathname: "/about" });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations("about");

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

  return (
    <>
      <section className="site-section py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold sm:text-5xl">{t("title")}</h1>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-20">
            <div className="site-card-soft rounded-2xl p-8 sm:p-10">
              <p className="text-lg leading-relaxed text-muted">
                {t("story")}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mb-20">
            {[
              {
                value: t("stats.projects"),
                label: t("stats.projectsLabel"),
                icon: FolderKanban,
              },
              {
                value: t("stats.clients"),
                label: t("stats.clientsLabel"),
                icon: Users,
              },
              {
                value: t("stats.years"),
                label: t("stats.yearsLabel"),
                icon: CalendarDays,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="site-card group text-center rounded-2xl
                  p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-elevated"
              >
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl
                    bg-gradient-to-br from-primary/10 to-secondary/10 text-primary
                    transition-all duration-300
                    group-hover:from-primary group-hover:to-secondary group-hover:text-white"
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-extrabold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div
              className="site-card rounded-2xl p-8
                transition-all duration-300 hover:shadow-elevated"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl
                    animated-gradient text-white"
                >
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">{t("mission")}</h2>
              </div>
              <p className="text-muted leading-relaxed">{t("missionText")}</p>
            </div>

            <div
              className="site-card rounded-2xl p-8
                transition-all duration-300 hover:shadow-elevated"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl
                    animated-gradient text-white"
                >
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">{t("vision")}</h2>
              </div>
              <p className="text-muted leading-relaxed">{t("visionText")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
