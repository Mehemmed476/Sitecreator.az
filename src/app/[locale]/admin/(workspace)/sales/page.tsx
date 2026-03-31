import { redirect } from "next/navigation";

export default async function AdminSalesIndexPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin/sales/messages`);
}
