"use client";
import { usePathname } from "next/navigation";
import { isPublicPage } from "@/lib/publicPaths";

// 승인 대기 중인 수강생에게 공개 커뮤니티 화면은 그대로, 나머지는 안내 화면을 보여줍니다.
// 레이아웃은 페이지를 옮겨도 다시 그려지지 않으므로 주소 판단은 여기(클라이언트)서 합니다.
// 과정 콘텐츠 자체는 데이터 단계(viewerOf/getMyRooms)에서 이미 막혀 있습니다.
export default function PendingGate({ notice, children }: { notice: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  return <>{isPublicPage(pathname) ? children : notice}</>;
}
