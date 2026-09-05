"use client";
import { useMyPrograms } from "@/lib/useMyPrograms";
import EmptyMyCourses from "@/components/EmptyMyCourses";
import ProgramAlumni from "@/components/ProgramAlumni";

export default function AlumniPage() {
  const programs = useMyPrograms();

  return (
    <>
      <div className="phead">
        <div><h1>취업정보</h1><p>담아둔 수업이 끝나도 취업·다음 세션 소식은 계속 이어져요.</p></div>
      </div>

      {programs && programs.length === 0 && <EmptyMyCourses />}

      {programs?.map((p) => (
        <div key={p.id} style={{ marginBottom: 26 }}>
          <div className="bh" style={{ marginTop: 0 }}><h3>{p.title}</h3><span className="pill v">{p.status}</span></div>
          <ProgramAlumni p={p} />
        </div>
      ))}
    </>
  );
}
