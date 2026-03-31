import { Code2, Headphones, Palette, Search, ShoppingCart, Smartphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";

const serviceIcons = [Palette, Code2, Search, Smartphone, ShoppingCart, Headphones];

export function HomeServicesSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ title: string; description: string; href?: string }>;
}) {
  return (
    <section className="site-section site-section-alt py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeading title={title} description={description} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = serviceIcons[index] ?? Code2;
            const cardClassName =
              "site-card group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated";
            const cardBody = (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary transition-colors duration-300 group-hover:from-primary group-hover:to-secondary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </>
            );

            return (
              item.href ? (
                <Link key={`${item.title}-${index}`} href={item.href} className={cardClassName}>
                  {cardBody}
                </Link>
              ) : (
                <div key={`${item.title}-${index}`} className={cardClassName}>
                  {cardBody}
                </div>
              )
            );
          })}
        </div>
      </div>
    </section>
  );
}
