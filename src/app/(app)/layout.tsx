import AppShell from "@/components/AppShell";
import PendingNotice from "@/components/PendingNotice";
import { getCurrentUser } from "@/lib/currentUser";
import { seed } from "@/lib/seed";
import { counts } from "@/lib/members";
import PendingGate from "@/components/PendingGate";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();

  const profile = user
    ? { name: user.name, cohort: user.cohortLabel, role: user.role, status: user.status, signedIn: true }
    : { name: "게스트", cohort: "비회원", role: seed.me.role, status: "pending" as const, signedIn: false };

  // 운영자에게만 승인 대기 건수를 뱃지로 보여줍니다.
  const pendingCount = user?.role === "admin" ? counts().pending : 0;

  // 승인 전(또는 반려된) 수강생에게는 공개 커뮤니티 화면 말고는 안내 화면만 보입니다.
  const blocked = user && user.role === "member" && user.status !== "approved";

  return (
    <AppShell profile={profile} pendingCount={pendingCount}>
      {blocked && user ? (
        <PendingGate
          notice={
            <PendingNotice
              name={user.name}
              email={user.email}
              cohortId={user.cohortId}
              status={user.status === "rejected" ? "rejected" : "pending"}
            />
          }
        >
          {children}
        </PendingGate>
      ) : (
        children
      )}
    </AppShell>
  );
}
