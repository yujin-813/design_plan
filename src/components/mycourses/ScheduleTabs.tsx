"use client";
import { useState } from "react";
import CurriculumCalendar from "@/components/CurriculumCalendar";

export type ScheduleTab = { cohortId: string; label: string; stateLabel: string };

// 여러 기수를 들으면 탭으로 골라 봅니다. 하나뿐이면 탭 없이 바로 달력만.
export default function ScheduleTabs({ tabs }: { tabs: ScheduleTab[] }) {
  const [active, setActive] = useState(tabs[0]?.cohortId ?? null);

  if (tabs.length === 0) {
    return <CurriculumCalendar cohortId={null} />;
  }

  return (
    <>
      {tabs.length > 1 && (
        <div className="chtabs" style={{ marginBottom: 18 }}>
          {tabs.map((t) => (
            <div
              key={t.cohortId}
              className={"chtab" + (t.cohortId === active ? " on" : "")}
              onClick={() => setActive(t.cohortId)}
            >
              {t.label} · {t.stateLabel}
            </div>
          ))}
        </div>
      )}
      <CurriculumCalendar cohortId={active} />
    </>
  );
}
