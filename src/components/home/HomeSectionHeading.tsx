export function HomeSectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-14 text-center">
      <h2 className="site-home-title text-3xl font-bold sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-lg text-muted">{description}</p> : null}
    </div>
  );
}
