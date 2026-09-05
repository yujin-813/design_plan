import Link from "next/link";
import { seed } from "@/lib/seed";
import { getPosts } from "@/lib/data";
import MyAgenda from "@/components/MyAgenda";
import { buildMonthGrid, monthLabel } from "@/lib/calendarGrid";

const actions = [
  {
    href: "/events", title: "이벤트 신청", desc: "온라인·오프라인 모임 참여하기",
    icon: <><path d="M3 8l9-5 9 5-9 5z" /><path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" /></>,
  },
  {
    href: "/mentors", title: "멘토링 신청", desc: "1:1로 커리어 고민 나누기",
    icon: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M17 11l2 2 4-4" /></>,
  },
  {
    href: "/community", title: "글쓰기", desc: "자유수다에 이야기 남기기",
    icon: <><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></>,
  },
  {
    href: "/community", title: "멤버 찾기", desc: "다른 멤버들과 이야기 나누기",
    icon: <><circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 20a6.5 6.5 0 0113 0M14.5 20a5 5 0 018 0" /></>,
  },
];

const tagClass: Record<string, string> = { "운영 공지": "tk-model", "커뮤니티 활동": "tk-mkt", "시스템": "tk-policy" };

function parseMonthDay(date: string) {
  const m = date.match(/^(\d{2})\.(\d{2})/);
  return m ? { month: m[1], day: m[2] } : { month: "", day: "" };
}

export default async function HomePage() {
  const posts = (await getPosts()).slice(0, 2);
  const notices = seed.notices.slice(0, 2);
  const events = seed.events.slice(0, 2);
  return (
    <>
      <div className="hero" style={{ gridTemplateColumns: "1fr" }}>
        <MyAgenda />
      </div>

      <div className="actions">
        {actions.map((a) => (
          <Link className="action-card" href={a.href} key={a.title}>
            <span className="aico"><svg className="ico" viewBox="0 0 24 24">{a.icon}</svg></span>
            <div><b>{a.title}</b><small>{a.desc}</small></div>
          </Link>
        ))}
      </div>

      <div className="home2">
        <div>
          <div className="bh"><h3>다가오는 행사</h3><Link className="more" href="/events">전체 보기 ›</Link></div>
          <div className="grid3">
            {seed.events.slice(0, 3).map((e) => (
              <div className="evcard card" style={{ padding: 0 }} key={e.id}>
                <div className="top" style={{ background: `linear-gradient(to top, rgba(15,10,5,.72), rgba(15,10,5,.08)), url(${e.image}) center/cover no-repeat` }}>
                  <span className="lv">{e.type}</span>
                  <h4>{e.title}</h4>
                </div>
                <div className="bd">
                  <div className="dt"><svg className="ico" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18" /></svg>{e.date}</div>
                  <button className="btn v" style={{ width: "100%" }}>{e.price}</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bh"><h3>지금 둘러볼 수 있는 수업</h3><Link className="more" href="/programs">강의목록 ›</Link></div>
          <div className="grid3">
            {seed.programs.filter((p) => p.status === "모집 중" || p.status === "진행 중").map((p) => (
              <Link className="evcard card" style={{ padding: 0, display: "block" }} href={`/programs/${p.id}`} key={p.id}>
                <div className="top" style={{ background: p.color }}>
                  <span className="lv">{p.status}</span>
                  <h4>{p.title}</h4>
                </div>
                <div className="bd">
                  <div className="dt">{p.format}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bh"><h3>오늘의 AI 뉴스</h3><Link className="more" href="/news">전체 보기 ›</Link></div>
          <div className="card"><div style={{ padding: "4px 18px" }}>
            {seed.news.slice(0, 3).map((n) => (
              <Link className="newsmini" href={`/news/${n.id}`} key={n.id} style={{ display: "flex" }}>
                <span className={"tk tk-" + n.cat}>{n.tk}</span>
                <div><p>{n.title}</p><small>{n.source} · {n.ago}</small></div>
              </Link>
            ))}
          </div></div>

          <div className="bh"><h3>오늘의 자유수다</h3><Link className="more" href="/community">채널 전체 ›</Link></div>
          <div className="feed">
            {posts.map((p) => (
              <Link className="post card" href={`/community/${p.id}`} key={p.id} style={{ display: "flex" }}>
                <div className="av" style={{ background: p.color }}>{p.author.slice(0, 1)}</div>
                <div className="b">
                  <div className="m"><b>{p.author}</b>{p.cohort && <span className="pill v">{p.cohort}</span>}· {p.cat} · {p.ago}</div>
                  <h4>{p.title}</h4><p className="ex">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rail">
          <div className="card">
            <Calendar />
          </div>
          <div className="card">
            <h3>공지사항 <Link className="more" href="/notices">전체</Link></h3>
            {notices.map((n) => (
              <Link className="newsmini" href={`/notices/${n.id}`} key={n.id} style={{ display: "flex" }}>
                <span className={"tk " + (tagClass[n.category] ?? "tk-model")}>{n.category}</span>
                <div><p>{n.title}</p><small>{n.by} · {n.date}</small></div>
              </Link>
            ))}
          </div>
          <div className="card">
            <h3>다가오는 일정 <Link className="more" href="/events">전체</Link></h3>
            {events.map((e) => {
              const { month, day } = parseMonthDay(e.date);
              return (
                <div className="evi" key={e.id}>
                  <div className="d"><b>{day}</b><small>{month}월</small></div>
                  <div><p>{e.title}</p><small>{e.date.split("· ")[1] ?? e.type}</small></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Calendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month0 = today.getMonth();
  const dows = ["월", "화", "수", "목", "금", "토", "일"];

  const eventDays = new Set(
    seed.events
      .map((e) => e.date.match(/^(\d{2})\.(\d{2})/))
      .filter((m): m is RegExpMatchArray => !!m && Number(m[1]) === month0 + 1)
      .map((m) => Number(m[2]))
  );

  const cells = buildMonthGrid(year, month0, today).map((c) => ({
    ...c,
    cls: c.cls + (c.inMonth && eventDays.has(c.n) ? " ev" : ""),
  }));

  return (
    <>
      <div className="calh">
        <b>{monthLabel(year, month0)}</b>
        <span className="pill v" style={{ fontSize: 10.5 }}>오늘 · {String(month0 + 1).padStart(2, "0")}.{String(today.getDate()).padStart(2, "0")}</span>
        <div className="nb"><span>‹</span><span>›</span></div>
      </div>
      <div className="cal">
        {dows.map((d) => <div className="dw" key={d}>{d}</div>)}
        {cells.map((c, i) => <div className={"dc " + c.cls} key={i}>{c.n}</div>)}
      </div>
    </>
  );
}
