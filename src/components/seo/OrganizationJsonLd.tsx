import { buildOrganizationSchema } from "@/lib/seo";

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildOrganizationSchema()),
      }}
    />
  );
}
