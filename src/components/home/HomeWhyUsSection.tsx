import { Clock, Cpu, Trophy } from "lucide-react";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";

const whyUsIcons = [Trophy, Cpu, Clock];

export function HomeWhyUsSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <section className="site-section py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeading title={title} description={description} />

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = whyUsIcons[index] ?? Trophy;

            return (
              <div key={`${item.title}-${index}`} className="space-y-4 text-center">
                <div className="animated-gradient mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg animate-pulse-glow">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="leading-relaxed text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
