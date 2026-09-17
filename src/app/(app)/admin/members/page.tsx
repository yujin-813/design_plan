import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { counts, listMembers } from "@/lib/members";
import AdminMembers from "@/components/AdminMembers";

export const dynamic = "force-dynamic";

export default function AdminMembersPage() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return <AdminMembers initialMembers={listMembers()} initialCounts={counts()} />;
}
