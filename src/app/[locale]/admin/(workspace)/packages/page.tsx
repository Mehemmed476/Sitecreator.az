import { redirect } from "next/navigation";

export default async function AdminPackagesIndexPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin/packages/content`);
}
