import EventsFeed from "@/components/EventsFeed";

export default function EventsPage() {
  return (
    <>
      <div className="phead">
        <div><h1>이벤트</h1><p>온라인·오프라인 모임, 특강까지 모두 여기서. 기수 관계없이 누구나 신청할 수 있어요.</p></div>
      </div>
      <EventsFeed />
    </>
  );
}
