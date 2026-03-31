import { HomeCtaSection } from "@/components/home/HomeCtaSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeFeaturedProjectsSection } from "@/components/home/HomeFeaturedProjectsSection";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { HomeMarketSection } from "@/components/home/HomeMarketSection";
import { HomePortalFeatureSection } from "@/components/home/HomePortalFeatureSection";
import { HomeServicesSection } from "@/components/home/HomeServicesSection";
import { HomeTestimonialsSection } from "@/components/home/HomeTestimonialsSection";
import { HomeWhyUsSection } from "@/components/home/HomeWhyUsSection";
import type { PortfolioLite } from "@/lib/homepage";
import type { HomepageLocaleContent } from "@/lib/homepage-content";
import type { SocialProofLocaleContent } from "@/lib/social-proof-content";
import type { ServiceListItem } from "@/lib/service-pages-store";

export function HomePageContent({
  featuredProjects,
  content,
  socialProof,
  serviceLinks,
}: {
  featuredProjects: PortfolioLite[];
  content: HomepageLocaleContent;
  socialProof: SocialProofLocaleContent;
  serviceLinks: ServiceListItem[];
}) {
  return (
    <>
      <HomeHeroSection
        badge={content.heroBadge}
        title={content.heroTitle}
        titleHighlight={content.heroTitleHighlight}
        description={content.heroDescription}
        primaryCta={content.heroPrimaryCta}
        secondaryCta={content.heroSecondaryCta}
      />

      <HomeServicesSection
        title={content.servicesTitle}
        description={content.servicesDescription}
        items={content.serviceItems.map((item, index) => ({
          ...item,
          href: serviceLinks[index] ? `/services/${serviceLinks[index].slug}` : undefined,
        }))}
      />

      <HomeWhyUsSection
        title={content.whyUsTitle}
        description={content.whyUsDescription}
        items={content.whyUsItems}
      />

      <HomePortalFeatureSection
        eyebrow={content.portalFeatureEyebrow}
        title={content.portalFeatureTitle}
        description={content.portalFeatureDescription}
        items={content.portalFeatureItems}
        primaryCta={content.portalFeaturePrimaryCta}
        secondaryCta={content.portalFeatureSecondaryCta}
      />

      <HomeMarketSection
        eyebrow={content.marketEyebrow}
        title={content.marketTitle}
        intro={content.marketIntro}
        bullets={content.marketBullets}
      />

      <HomeTestimonialsSection
        eyebrow={socialProof.testimonialsEyebrow}
        title={socialProof.testimonialsTitle}
        description={socialProof.testimonialsDescription}
        items={socialProof.testimonials}
      />

      <HomeFaqSection
        eyebrow={socialProof.faqEyebrow}
        title={socialProof.faqTitle}
        description={socialProof.faqDescription}
        items={socialProof.faqItems}
      />

      <HomeCtaSection
        title={content.ctaTitle}
        description={content.ctaDescription}
        cta={content.ctaButton}
      />

      <HomeFeaturedProjectsSection
        title={content.featuredTitle}
        emptyState={content.featuredEmptyState}
        projects={featuredProjects}
      />
    </>
  );
}
