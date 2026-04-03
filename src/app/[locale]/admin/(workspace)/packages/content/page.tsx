import { AdminPackagesShell } from "@/components/admin/dashboard/AdminPackagesShell";
import { PackageSolutionsManager } from "@/components/admin/dashboard/PackageSolutionsManager";

export default function AdminPackagesContentPage() {
  return (
    <AdminPackagesShell
      title="Ümumi paket səhifəsi ayarları"
      description="Bu bölmədə paket list səhifəsinin badge, başlıq və təsvirini üç dil üzrə ayrıca idarə edirsən."
    >
      <PackageSolutionsManager mode="content" />
    </AdminPackagesShell>
  );
}
