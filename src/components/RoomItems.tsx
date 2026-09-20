import Link from "next/link";
import AssignmentUpload from "@/components/AssignmentUpload";
import { shortDate, type ContentItem } from "@/lib/content";

// 강의실 하나의 항목 목록(공지·자료·과제)을 그립니다.
// 운영자가 '콘텐츠 관리'에서 올린 것이 여기로 들어옵니다.
// 제목·배지는 바깥(RoomFilter)에서 그리므로 여기서는 목록만 냅니다.
export default function RoomItems({
  kind,
  items,
  submitKey,
}: {
  kind: "notice" | "material" | "assignment";
  items: ContentItem[];
  submitKey?: string;
}) {
  const empty = {
    notice: "아직 올라온 기수 공지가 없어요.",
    material: "아직 공유된 기수 자료가 없어요.",
    assignment: "아직 등록된 기수 과제가 없어요.",
  }[kind];

  return (
    <div className="card">
        {items.length === 0 && (
          <p style={{ padding: 22, margin: 0, color: "var(--faint)", textAlign: "center" }}>{empty}</p>
        )}

        {items.map((item, i) => (
          <div key={item.id} style={{ padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
            {kind === "notice" ? (
              <Link href={`/my-courses/notices/${item.id}`} style={{ display: "block" }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>{item.title}</p>
                <small style={{ color: "var(--faint)" }}>{item.createdBy} · {shortDate(item.createdAt)}</small>
              </Link>
            ) : kind === "material" ? (
              item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>📎 {item.title}</p>
                  <small style={{ color: "var(--faint)" }}>{shortDate(item.createdAt)}</small>
                </a>
              ) : (
                <>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>📎 {item.title}</p>
                  <small style={{ color: "var(--faint)" }}>{shortDate(item.createdAt)}</small>
                  {item.body && (
                    <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)", whiteSpace: "pre-line" }}>{item.body}</p>
                  )}
                </>
              )
            ) : (
              <>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>{item.title}</p>
                <small style={{ color: "var(--faint)" }}>{item.dueLabel || shortDate(item.createdAt)}</small>
                {item.body && (
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)", whiteSpace: "pre-line" }}>{item.body}</p>
                )}
                {submitKey && <AssignmentUpload programId={submitKey} assignment={item.id} />}
              </>
            )}
          </div>
      ))}
    </div>
  );
}
