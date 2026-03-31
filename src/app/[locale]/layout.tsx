import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    template: "%s | Sitecreator",
    default: "Sitecreator | Web Development Agency",
  },
  description:
    "Sitecreator builds modern websites, e-commerce systems, and search-friendly digital experiences for businesses in Azerbaijan.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <Chrome>{children}</Chrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
