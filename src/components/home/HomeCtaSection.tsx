import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function HomeCtaSection({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <section className="site-section py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="animated-gradient relative overflow-hidden rounded-3xl p-10 text-center text-white sm:p-16">
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">{description}</p>
            <Link
              href="/contact"
              className="site-card-soft inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
