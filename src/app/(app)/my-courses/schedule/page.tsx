import CurriculumCalendar from "@/components/CurriculumCalendar";

export default function MyCoursesSchedulePage() {
  return (
    <>
      <div className="phead">
        <div><h1>일정확인</h1><p>수업 일정을 달력으로 확인하세요. 날짜를 누르면 그날 교과목이 보입니다.</p></div>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <CurriculumCalendar />
      </div>
    </>
  );
}
