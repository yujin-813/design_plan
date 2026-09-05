import { seed } from "@/lib/seed";
import { buildMonthGrid, monthLabel } from "@/lib/calendarGrid";

function extractDue(due: string) {
  const m = due.match(/마감\s*(\d{2})\.(\d{2})/);
  return m ? { month: Number(m[1]), day: Number(m[2]) } : null;
}

export default function MyCoursesCalendar({ programs, size = "sm" }: { programs: typeof seed.programs; size?: "sm" | "lg" }) {
  const today = new Date();
  const year = today.getFullYear();
  const month0 = today.getMonth();

  const dueItems = programs.flatMap((p) =>
    p.room.assignments
      .filter((a) => a.due.startsWith("마감"))
      .map((a) => ({ course: p.title, title: a.title, ...extractDue(a.due) }))
  ).filter((d): d is { course: string; title: string; month: number; day: number } => d.month != null);

  const dueDaysThisMonth = new Set(dueItems.filter((d) => d.month === month0 + 1).map((d) => d.day));

  const dows = ["월", "화", "수", "목", "금", "토", "일"];
  const cells = buildMonthGrid(year, month0, today).map((c) => ({
    ...c,
    cls: c.cls + (c.inMonth && dueDaysThisMonth.has(c.n) ? " ev" : ""),
  }));

  const large = size === "lg";

  return (
    <>
      <div className="calh" style={{ marginTop: large ? 0 : 10 }}>
        <b style={{ fontSize: large ? 20 : undefined }}>{monthLabel(year, month0)}</b>
        {large && <div className="nb"><span>‹</span><span>›</span></div>}
      </div>
      <div className={"cal" + (large ? " cal-lg" : "")}>
        {dows.map((d) => <div className="dw" key={d}>{d}</div>)}
        {cells.map((c, i) => <div className={"dc " + c.cls} key={i}>{c.n}</div>)}
      </div>
      {dueItems.length > 0 && (
        <div style={{ marginTop: large ? 22 : 14, display: "flex", flexDirection: "column", gap: large ? 10 : 6 }}>
          {dueItems.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: large ? 14 : 12.5, padding: large ? "10px 14px" : 0, background: large ? "var(--warm-soft)" : "transparent", borderRadius: large ? 10 : 0 }}>
              <span style={{ color: "var(--muted)" }}>{d.month}월 {d.day}일 · {d.course}</span>
              <b style={{ color: large ? "var(--warm-ink)" : undefined }}>{d.title}</b>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
