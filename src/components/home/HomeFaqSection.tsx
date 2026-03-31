import { ChevronDown } from "lucide-react";

export function HomeFaqSection({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="site-section py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="site-kicker">{eyebrow}</p>
          <h2 className="site-home-title mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">{description}</p>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <details
              key={`${item.question}-${index}`}
              className="site-card group rounded-[24px] p-0 open:border-primary/20 open:bg-primary/[0.04]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="text-base font-semibold text-foreground sm:text-lg">
                  {item.question}
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <div className="border-t border-white/8 px-6 pb-6 pt-4 text-sm leading-7 text-muted sm:text-base">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
