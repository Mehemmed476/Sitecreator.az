import { AdminPackagesShell } from "@/components/admin/dashboard/AdminPackagesShell";
import { PackageSolutionsManager } from "@/components/admin/dashboard/PackageSolutionsManager";

export default function AdminPackagesItemsPage() {
  return (
    <AdminPackagesShell
      title="Paketləri ayrıca idarə et"
      description="Burada bir-bir paket yaratmaq, seçmək, silmək, sıralamaq və bütün lokal məzmununu redaktə etmək olur."
    >
      <PackageSolutionsManager mode="packages" />
    </AdminPackagesShell>
  );
}
