import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function HomeHeroSection({
  badge,
  title,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
}: {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}) {
  return (
    <section className="site-section relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in-up">
            {badge}
          </div>

          <h1 className="animate-fade-in-up animate-delay-100 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
            <br />
            <span className="gradient-text">{titleHighlight}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-fade-in-up animate-delay-200 text-lg leading-relaxed text-muted">
            {description}
          </p>

          <div className="mt-10 flex animate-fade-in-up animate-delay-300 flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-primary text-base">
              {primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/portfolio" className="btn-secondary text-base">
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
