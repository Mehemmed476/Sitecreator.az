import { redirect } from "next/navigation";

export default async function AdminProjectsRedirectPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin/sales/projects`);
}
