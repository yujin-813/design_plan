import { redirect } from "next/navigation";
import AdminContent from "@/components/AdminContent";
import { getCurrentUser } from "@/lib/currentUser";
import { listAll } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") redirect("/");

  return (
    <>
      <div className="phead">
        <div>
          <h1>콘텐츠 관리</h1>
          <p>레터·뉴스·프로젝트·공지·과제·자료·이벤트를 직접 올리고, 전체에 보낼지 특정 기수에만 보낼지 고를 수 있어요.</p>
        </div>
      </div>
      <AdminContent initialItems={listAll()} />
    </>
  );
}
