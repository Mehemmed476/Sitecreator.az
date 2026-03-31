import { ArrowRight } from "lucide-react";
import { HomeHeroShowcase } from "@/components/home/HomeHeroShowcase";
import { Link } from "@/i18n/navigation";
import type { HomepageLocale } from "@/lib/homepage-content";

export function HomeHeroSection({
  locale,
  badge,
  title,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
}: {
  locale: HomepageLocale;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}) {
  const titleWords = title.split(" ").filter(Boolean);

  return (
    <section className="site-section hero-section relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="hero-backdrop-beam hero-backdrop-beam-left" />
        <div className="hero-backdrop-beam hero-backdrop-beam-right" />
        <div className="hero-film-grain" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)]">
          <div className="max-w-3xl">
            <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary">
              {badge}
            </div>

            <h1 className="hero-title text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="hero-title-line">
                {titleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="hero-title-word"
                    style={{ animationDelay: `${120 + index * 90}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="hero-title-highlight gradient-text">{titleHighlight}</span>
            </h1>

            <p className="hero-description mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {description}
            </p>

            <div className="hero-cta-row mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary text-base">
                {primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/portfolio" className="btn-secondary text-base">
                {secondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative">
            <HomeHeroShowcase locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
