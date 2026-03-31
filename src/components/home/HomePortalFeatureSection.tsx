import { FolderKanban, FileText, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

const portalIcons = [FileText, FolderKanban, ShieldCheck];

export function HomePortalFeatureSection({
  eyebrow,
  title,
  description,
  items,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ title: string; description: string }>;
  primaryCta: string;
  secondaryCta: string;
}) {
  return (
    <section className="site-section-alt py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)] lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">{eyebrow}</p>
            <h2 className="site-home-title text-3xl font-bold sm:text-4xl">{title}</h2>
            <p className="max-w-2xl text-lg leading-8 text-muted">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/price-calculator" className="btn-primary">
              {primaryCta}
            </Link>
            <Link href="/portal/login" className="btn-secondary">
              {secondaryCta}
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {items.map((item, index) => {
            const Icon = portalIcons[index] ?? ShieldCheck;

            return (
              <div key={`${item.title}-${index}`} className="site-card rounded-[28px] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
