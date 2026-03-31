import type { QuickAction } from "@/components/contact/contact-utils";

export function ContactHeroPanel({
  badge,
  title,
  description,
  responseLabel,
  responseValue,
  businessHoursLabel,
  businessHoursValue,
  quickActions,
  trustItems,
}: {
  badge: string;
  title: string;
  description: string;
  responseLabel: string;
  responseValue: string;
  businessHoursLabel: string;
  businessHoursValue: string;
  quickActions: QuickAction[];
  trustItems: string[];
}) {
  return (
    <div className="site-card-highlight relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-16 right-0 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{badge}</p>
      <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <MetricCard label={responseLabel} value={responseValue} />
        <MetricCard label={businessHoursLabel} value={businessHoursValue} />
      </div>

      {quickActions.length > 0 ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <a
                key={action.key}
                href={action.href}
                className={action.primary ? "btn-primary justify-center text-base" : "btn-secondary justify-center text-base"}
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </a>
            );
          })}
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {trustItems.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-white/40 px-4 py-4 text-sm font-medium text-foreground backdrop-blur dark:bg-white/[0.03]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/45 p-4 backdrop-blur dark:bg-white/[0.03]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
