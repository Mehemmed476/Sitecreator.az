import { Quote, Star } from "lucide-react";
import type { SocialProofTestimonial } from "@/lib/social-proof-content";

export function HomeTestimonialsSection({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: SocialProofTestimonial[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="site-section site-section-alt py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="site-kicker">{eyebrow}</p>
          <h2 className="site-home-title mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted">{description}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={`${item.author}-${index}`}
              className="site-card group rounded-[28px] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Quote className="h-5 w-5" />
                </span>
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>

              <p className="mt-6 text-base leading-7 text-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="mt-8 border-t border-white/8 pt-5">
                <p className="text-base font-semibold">{item.author}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.role}
                  {item.company ? ` • ${item.company}` : ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
