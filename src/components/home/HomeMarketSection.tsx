export function HomeMarketSection({
  eyebrow,
  title,
  intro,
  bullets,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  bullets: string[];
}) {
  return (
    <section className="site-section py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="site-card-soft rounded-[2rem] p-8 sm:p-10">
          <p className="site-kicker">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted sm:text-lg">{intro}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {bullets.map((item) => (
              <div key={item} className="site-card rounded-2xl p-5 text-sm leading-6 text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
