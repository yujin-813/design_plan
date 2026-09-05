import AppShell from "@/components/AppShell";
import { getProfile } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return <AppShell profile={profile}>{children}</AppShell>;
}
