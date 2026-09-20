"use client";
import { useMemo, useState } from "react";

export type RoomSummary = {
  cohortId: string;
  /** 서버에서 미리 그려 넘긴 강의실 내용 */
  content: React.ReactNode;
  course: string;
  cohortLabel: string;
  label: string;
  period: string;
  org: string;
  state: "active" | "completed" | "dropped";
  stateLabel: string;
  counts: { notices: number; materials: number; assignments: number };
};

const STATE_PILL: Record<RoomSummary["state"], string> = {
  active: "mint",
  completed: "v",
  dropped: "ghost",
};

const STATE_TABS = [
  { key: "all", label: "전체" },
  { key: "active", label: "수강 중" },
  { key: "completed", label: "수료" },
] as const;

/** 내가 듣는 강의실을 강의명·상태로 걸러 보여줍니다. */
export default function RoomFilter({ rooms }: { rooms: RoomSummary[] }) {
  const [course, setCourse] = useState("전체");
  const [state, setState] = useState<(typeof STATE_TABS)[number]["key"]>("all");

  const courses = useMemo(() => ["전체", ...new Set(rooms.map((r) => r.course))], [rooms]);

  const shown = useMemo(
    () =>
      rooms.filter(
        (r) => (course === "전체" || r.course === course) && (state === "all" || r.state === state)
      ),
    [rooms, course, state]
  );

  const activeCount = rooms.filter((r) => r.state === "active").length;
  const doneCount = rooms.filter((r) => r.state === "completed").length;

  if (rooms.length === 0) {
    return (
      <div className="card" style={{ padding: 28, textAlign: "center", color: "var(--faint)" }}>
        아직 배정된 강의가 없어요. 운영팀 승인 후에 강의실이 열립니다.
      </div>
    );
  }

  return (
    <>
      <div className="kpis" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi card"><b>{rooms.length}</b><small>전체 강의</small></div>
        <div className="kpi card"><b>{activeCount}</b><small>수강 중</small></div>
        <div className="kpi card"><b>{doneCount}</b><small>수료</small></div>
      </div>

      {/* 상태 필터 */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {STATE_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={"btn sm" + (state === t.key ? " v" : "")}
            onClick={() => setState(t.key)}
          >
            {t.label}
            {t.key === "active" && activeCount > 0 ? ` (${activeCount})` : ""}
            {t.key === "completed" && doneCount > 0 ? ` (${doneCount})` : ""}
          </button>
        ))}
      </div>

      {/* 강의명 필터 — 강의가 하나뿐이면 굳이 보여주지 않습니다 */}
      {courses.length > 2 && (
        <div className="chtabs" style={{ marginBottom: 16 }}>
          {courses.map((c) => (
            <div className={"chtab" + (c === course ? " on" : "")} key={c} onClick={() => setCourse(c)}>
              {c}
            </div>
          ))}
        </div>
      )}

      {shown.length === 0 && (
        <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--faint)" }}>
          조건에 맞는 강의가 없어요.
        </div>
      )}

      {shown.map((r) => (
        <div key={r.cohortId} style={{ marginBottom: 26 }}>
          <div className="bh" style={{ marginTop: 0 }}>
            <h3>{r.label}</h3>
            <span className={"pill " + STATE_PILL[r.state]}>{r.stateLabel}</span>
          </div>
          <p style={{ margin: "-6px 0 10px", fontSize: 12.5, color: "var(--faint)" }}>
            {r.org} · {r.period} · 공지 {r.counts.notices} · 자료 {r.counts.materials} · 과제 {r.counts.assignments}
          </p>
          {r.content}
        </div>
      ))}
    </>
  );
}
