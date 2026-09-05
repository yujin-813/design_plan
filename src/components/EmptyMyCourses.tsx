import Link from "next/link";

export default function EmptyMyCourses() {
  return (
    <div className="card" style={{ padding: 32, textAlign: "center" }}>
      <p style={{ margin: "0 0 14px", color: "var(--muted)" }}>아직 담아둔 수업이 없어요.</p>
      <Link className="btn v" href="/programs">강의목록 ›</Link>
    </div>
  );
}
