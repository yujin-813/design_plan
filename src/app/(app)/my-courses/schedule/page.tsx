"use client";
import { useMyPrograms } from "@/lib/useMyPrograms";
import EmptyMyCourses from "@/components/EmptyMyCourses";
import MyCoursesCalendar from "@/components/MyCoursesCalendar";

export default function MyCoursesSchedulePage() {
  const programs = useMyPrograms();

  return (
    <>
      <div className="phead">
        <div><h1>일정확인</h1><p>담아둔 수업들의 진행 일정과 다가오는 마감을 달력으로 확인하세요.</p></div>
      </div>

      {programs && programs.length === 0 && <EmptyMyCourses />}

      {programs && programs.length > 0 && (
        <div className="card" style={{ padding: 28 }}>
          <MyCoursesCalendar programs={programs} size="lg" />
        </div>
      )}
    </>
  );
}
