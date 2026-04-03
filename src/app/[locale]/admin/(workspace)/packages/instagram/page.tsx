import { AdminPackagesShell } from "@/components/admin/dashboard/AdminPackagesShell";
import { PackageSolutionsManager } from "@/components/admin/dashboard/PackageSolutionsManager";

export default function AdminPackagesInstagramPage() {
  return (
    <AdminPackagesShell
      title="Paketdən birbaşa Instagram vizualları hazırla"
      description="Paket məlumatını əsas götürüb posterləri yarat, preview et və yüksək keyfiyyətli şəkil kimi yüklə."
    >
      <PackageSolutionsManager mode="instagram" />
    </AdminPackagesShell>
  );
}
