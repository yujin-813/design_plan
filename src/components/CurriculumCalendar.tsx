"use client";
import { useMemo, useState } from "react";
import { buildMonthGrid, monthLabel } from "@/lib/calendarGrid";
import { findCohort, getCurriculum, holidayName, trackStyle, weekHours, totalHours, type Track } from "@/lib/curriculum";

const DOWS = ["월", "화", "수", "목", "금", "토", "일"];

function ymd(year: number, month0: number, day: number) {
  return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// 로그인한 사람의 기수 일정을 보여줍니다. cohortId 는 서버에서 내려옵니다.
export default function CurriculumCalendar({ cohortId }: { cohortId: string | null }) {
  const cohort = cohortId ? findCohort(cohortId) : null;
  const curriculum = getCurriculum(cohortId);

  if (!cohort || !curriculum) {
    return (
      <div style={{ padding: "28px 8px", textAlign: "center", color: "var(--faint)" }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          {cohort
            ? `${cohort.label} 수업 일정이 아직 등록되지 않았어요.`
            : "배정된 기수가 없어요. 운영팀 승인 후에 일정이 열립니다."}
        </p>
      </div>
    );
  }

  return <CohortCalendar cohort={cohort} curriculum={curriculum} />;
}

function CohortCalendar({
  cohort,
  curriculum,
}: {
  cohort: NonNullable<ReturnType<typeof findCohort>>;
  curriculum: NonNullable<ReturnType<typeof getCurriculum>>;
}) {
  const { lessons, weeks } = curriculum;
  const today = new Date();
  // 과정 기간 안에서 시작하도록 맞춥니다.
  const first = lessons[0].date;
  const startYear = Number(first.slice(0, 4));
  const startMonth0 = Number(first.slice(5, 7)) - 1;
  const inRange = lessons.some((l) => l.date.startsWith(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`));

  const [year, setYear] = useState(inRange ? today.getFullYear() : startYear);
  const [month0, setMonth0] = useState(inRange ? today.getMonth() : startMonth0);
  const [picked, setPicked] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, (typeof lessons)[number]>();
    lessons.forEach((l) => map.set(l.date, l));
    return map;
  }, [lessons]);

  const monthLessons = useMemo(
    () => lessons.filter((l) => l.date.startsWith(`${year}-${String(month0 + 1).padStart(2, "0")}`)),
    [lessons, year, month0]
  );

  const cells = buildMonthGrid(year, month0, today);

  function shift(delta: number) {
    const d = new Date(year, month0 + delta, 1);
    setYear(d.getFullYear());
    setMonth0(d.getMonth());
    setPicked(null);
  }

  const pickedLesson = picked ? byDate.get(picked) : null;
  const monthHours = monthLessons.reduce((s, l) => s + l.hours, 0);

  return (
    <>
      <div className="cur-head">
        <div>
          <span className="pill v">{cohort.org}</span>
          <h2>{cohort.label} 교육 일정</h2>
          <p>{cohort.period} · 총 {lessons.length}일 {totalHours(curriculum)}시간</p>
        </div>
        <div className="nb">
          <button onClick={() => shift(-1)} aria-label="이전 달">‹</button>
          <b>{monthLabel(year, month0)}</b>
          <button onClick={() => shift(1)} aria-label="다음 달">›</button>
        </div>
      </div>

      <div className="cur-legend">
        {(Object.keys(trackStyle) as Track[]).map((t) => (
          <span key={t}><i style={{ background: trackStyle[t].color }} />{t}</span>
        ))}
        <span><i style={{ background: "var(--danger)" }} />공휴일</span>
        <span className="cur-legend-sum">이 달 수업 {monthLessons.length}일 · {monthHours}시간</span>
      </div>

      <div className="cal cal-lg cur-cal">
        {DOWS.map((d) => <div className="dw" key={d}>{d}</div>)}
        {cells.map((c, i) => {
          const date = c.inMonth ? ymd(year, month0, c.n) : null;
          const lesson = date ? byDate.get(date) : null;
          const style = lesson ? trackStyle[lesson.track] : null;
          const holiday = date ? holidayName(curriculum, date) : null;
          const dow = i % 7; // 0=월 … 5=토, 6=일
          const dowCls = dow === 5 ? " sat" : dow === 6 ? " sun" : "";
          return (
            <div
              key={i}
              className={
                "dc " + c.cls + dowCls + (lesson ? " has" : "") + (holiday ? " holi" : "") + (picked === date ? " sel" : "")
              }
              style={lesson ? { background: style!.soft, borderColor: style!.color } : undefined}
              onClick={() => date && lesson && setPicked(picked === date ? null : date)}
            >
              <span className="dnum">{c.n}</span>
              {holiday && <span className="dholi">{holiday}</span>}
              {lesson && (
                <>
                  <span className="dtrack" style={{ color: style!.color }}>{lesson.track}</span>
                  <span className="dsub">{lesson.subject}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {pickedLesson && (
        <div className="cur-detail" style={{ borderColor: trackStyle[pickedLesson.track].color }}>
          <div>
            <span className="eyebrow">{pickedLesson.week}주차 · {pickedLesson.date.replace(/-/g, ".")}</span>
            <b>{pickedLesson.subject}</b>
          </div>
          <div className="cur-detail-meta">
            <span className="pill" style={{ background: trackStyle[pickedLesson.track].soft, color: trackStyle[pickedLesson.track].color }}>
              {pickedLesson.track}
            </span>
            <span>{pickedLesson.hours}시간</span>
          </div>
        </div>
      )}

      <h3 className="cur-wh">주차별 구성</h3>
      <div className="cur-weeks">
        {weeks.map((w) => (
          <div className="cur-week" key={w.week}>
            <div className="cur-week-no">{w.week}주차</div>
            <div className="cur-week-main">
              <b>{w.theme}</b>
              <small>{w.range} · {weekHours(curriculum, w.week)}시간</small>
              {w.note && <span className="cur-week-note">※ {w.note}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
