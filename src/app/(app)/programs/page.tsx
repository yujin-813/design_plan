import ProgramsCatalog from "@/components/ProgramsCatalog";

export default function ProgramsPage() {
  return (
    <>
      <div className="phead">
        <div><h1>강의목록</h1><p>모집중 강의, 모집이 끝난 강의, 특별 강의를 한눈에 찾아보세요.</p></div>
      </div>
      <ProgramsCatalog />
    </>
  );
}
