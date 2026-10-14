import Link from "next/link";

// 수료·중도 종료한 강의실 자리에 보여주는 안내.
export default function ClosedRoom({ chat }: { chat: boolean }) {
  return (
    <div className="card" style={{ padding: 22, color: "var(--muted)", fontSize: 13.5, lineHeight: 1.7 }}>
      수업이 끝나 공지·자료·과제 공간은 닫혔어요.
      {chat && (
        <> 동기들과는 <Link className="more" href="/my-courses">내 수업의 동기 대화방</Link>에서 계속 이야기할 수 있어요.</>
      )}
      <br />제출했던 과제는 프로필에 남아 있어요.
    </div>
  );
}
