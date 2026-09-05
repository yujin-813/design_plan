import { seed } from "@/lib/seed";

function MentorCard({ m }: { m: (typeof seed.mentors)[number] }) {
  return (
    <div className="mentor card" key={m.name}>
      <div className="hd">
        <span className="av" style={{ background: m.color }}>{m.name.slice(0, 1)}</span>
        <div><h4>{m.name} <span className={"pill " + (m.available ? "mint" : "ghost")} style={{ verticalAlign: "middle" }}>{m.available ? "매칭 가능" : "대기 3명"}</span></h4><small>{m.headline}</small></div>
      </div>
      <div className="tagrow">{m.tags.map((t, i) => <span className={"pill " + (i < 2 ? "v" : "ghost")} key={t}>{t}</span>)}</div>
      <div className="meta"><span>★ <b>{m.rating}</b></span><span>멘티 <b>{m.mentee}</b></span><span>응답 <b>{m.resp}</b></span></div>
      <button className={"btn" + (m.available ? " v" : "")} style={{ width: "100%" }}>{m.available ? "매칭 신청" : "대기 신청"}</button>
    </div>
  );
}

export default function MentorsPage() {
  const available = seed.mentors.filter((m) => m.available);
  const waiting = seed.mentors.filter((m) => !m.available);

  return (
    <>
      <div className="phead">
        <div>
          <h1>멘토링 신청</h1>
          <p>지금 매칭 가능한 멘토 {available.length}명. 내 관심 분야에 맞는 멘토를 찾아 커리어·실무 고민을 편하게 나눠보세요.</p>
        </div>
        <button className="btn"><svg className="ico" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4" /></svg>조건으로 찾기</button>
      </div>

      {available.length > 0 && (
        <>
          <div className="bh" style={{ marginTop: 0 }}><h3>지금 매칭 가능</h3></div>
          <div className="grid2" style={{ marginBottom: waiting.length > 0 ? 26 : 0 }}>
            {available.map((m) => <MentorCard m={m} key={m.name} />)}
          </div>
        </>
      )}

      {waiting.length > 0 && (
        <>
          <div className="bh"><h3>대기 중</h3></div>
          <div className="grid2">
            {waiting.map((m) => <MentorCard m={m} key={m.name} />)}
          </div>
        </>
      )}
    </>
  );
}
