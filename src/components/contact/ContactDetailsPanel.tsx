import type { ContactCard } from "@/components/contact/contact-utils";

export function ContactDetailsPanel({
  kicker,
  title,
  description,
  cards,
}: {
  kicker: string;
  title: string;
  description: string;
  cards: ContactCard[];
}) {
  return (
    <div className="site-card-strong rounded-[2rem] p-6 sm:p-8">
      <div className="mb-6">
        <p className="site-kicker">{kicker}</p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-xl text-muted">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ key, icon: Icon, label, value, href, external }) => (
          <div key={key} className="site-card rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="break-words text-base font-medium transition-colors hover:text-primary"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="break-words text-base font-medium">{value}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
