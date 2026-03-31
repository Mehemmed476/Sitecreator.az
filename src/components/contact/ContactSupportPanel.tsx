import type { ContactCard } from "@/components/contact/contact-utils";

export function ContactSupportPanel({
  kicker,
  title,
  description,
  responseLabel,
  responseValue,
  cards,
}: {
  kicker: string;
  title: string;
  description: string;
  responseLabel: string;
  responseValue: string;
  cards: ContactCard[];
}) {
  return (
    <div className="space-y-4">
      <div className="site-card rounded-[2rem] p-8">
        <p className="site-kicker">{kicker}</p>
        <h3 className="mt-3 text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-muted">{description}</p>

        <div className="mt-6 space-y-3">
          {cards.slice(0, 4).map(({ key, icon: Icon, label, value, href, external }) => (
            <a
              key={key}
              href={href ?? "#"}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition-colors ${
                href ? "border-border hover:border-primary/40 hover:bg-primary/5" : "border-border/60"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                <p className="truncate text-sm font-medium sm:text-base">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="site-card-soft rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{responseLabel}</p>
        <p className="mt-3 text-xl font-semibold">{responseValue}</p>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  );
}
