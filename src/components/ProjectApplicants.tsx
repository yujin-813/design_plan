"use client";
import { useEffect, useState } from "react";

type Applicant = {
  id: string;
  name: string;
  cohortLabel: string;
  message: string;
  createdAt: string;
  submissions: { assignment: string; fileName: string; url: string; submittedAt: string }[];
};

// 운영자가 지원자를 고를 때 보는 목록. 기수와 과제 결과물을 함께 보여줍니다.
export default function ProjectApplicants({ projectId }: { projectId: string }) {
  const [list, setList] = useState<Applicant[] | null>(null);

  useEffect(() => {
    fetch(`/api/applications?projectId=${encodeURIComponent(projectId)}`)
      .then((r) => (r.ok ? r.json() : { applicants: [] }))
      .then((j) => setList(j.applicants ?? []));
  }, [projectId]);

  if (!list) return <p style={{ margin: 0, fontSize: 13, color: "var(--faint)" }}>불러오는 중…</p>;
  if (list.length === 0) return <p style={{ margin: 0, fontSize: 13, color: "var(--faint)" }}>아직 지원자가 없어요.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {list.map((a) => (
        <div key={a.id} style={{ padding: 14, border: "1px solid var(--border)", borderRadius: 11 }}>
          <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13.5 }}>
            {a.name} <span className="pill v" style={{ marginLeft: 6 }}>{a.cohortLabel}</span>
          </p>
          {a.message && <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--muted)", whiteSpace: "pre-line" }}>{a.message}</p>}
          <small style={{ color: "var(--faint)", display: "block", marginBottom: 4 }}>과제 결과물 {a.submissions.length}건</small>
          {a.submissions.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 12.5, color: "var(--violet-ink)" }}>
              {s.assignment} — {s.fileName}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
