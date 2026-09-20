import EventsFeed, { type FeedEvent } from "@/components/EventsFeed";
import { getCurrentUser, viewerOf } from "@/lib/currentUser";
import { cohortIdOf, listVisible } from "@/lib/content";
import { cohorts } from "@/lib/curriculum";

export const dynamic = "force-dynamic";

export default function EventsPage() {
  const user = getCurrentUser();
  const viewer = viewerOf(user);

  const authored: FeedEvent[] = listVisible("event", viewer).map((c) => {
    const cohortId = cohortIdOf(c.scope);
    return {
      id: c.id,
      title: c.title,
      type: "특강",
      level: "무료",
      price: "신청하기",
      date: c.dueLabel || c.body.slice(0, 40) || "일정 미정",
      color: "var(--violet-deep)",
      cohortLabel: cohortId ? cohorts.find((x) => x.id === cohortId)?.label ?? cohortId : undefined,
    };
  });

  return (
    <>
      <div className="phead">
        <div><h1>이벤트</h1><p>온라인·오프라인 모임, 특강까지 모두 여기서. 기수 관계없이 누구나 신청할 수 있어요.</p></div>
      </div>
      <EventsFeed authored={authored} />
    </>
  );
}
