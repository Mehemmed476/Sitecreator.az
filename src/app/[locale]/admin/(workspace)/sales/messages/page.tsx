import { AdminSalesShell } from "@/components/admin/dashboard/AdminSalesShell";
import { MessagesInbox } from "@/components/admin/dashboard/MessagesInbox";

export default function AdminSalesMessagesPage() {
  return (
    <AdminSalesShell
      title="Lead-lər və portal çevrilməsi"
      description="Əlaqə və kalkulyator müraciətlərini burada idarə et, status ver, qeyd yaz və bir kliklə proposal və layihəyə çevir."
    >
      <MessagesInbox />
    </AdminSalesShell>
  );
}
