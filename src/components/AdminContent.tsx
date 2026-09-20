"use client";
import { useMemo, useState } from "react";
import { cohorts } from "@/lib/curriculum";
import { KIND_LABEL, type ContentItem, type ContentKind } from "@/lib/content";

const TABS: { key: ContentKind; label: string; hint: string }[] = [
  { key: "notice", label: "공지사항", hint: "전체 공지 또는 특정 기수 공지로 나갑니다." },
  { key: "assignment", label: "과제", hint: "해당 기수 수강생의 '과제확인'에 뜨고, 파일 제출을 받습니다." },
  { key: "material", label: "자료", hint: "해당 기수 수강생의 '자료실'에 뜹니다." },
  { key: "event", label: "이벤트", hint: "이벤트 목록에 뜹니다. 전체 공개가 기본이에요." },
];

const NOTICE_CATEGORIES = ["운영 공지", "커뮤니티 활동", "시스템"];

type Draft = {
  title: string;
  body: string;
  scopeKey: string; // "all" 또는 기수 id
  category: string;
  pinned: boolean;
  dueLabel: string;
  url: string;
};

const emptyDraft = (): Draft => ({
  title: "",
  body: "",
  scopeKey: "all",
  category: NOTICE_CATEGORIES[0],
  pinned: false,
  dueLabel: "",
  url: "",
});

function scopeLabel(item: ContentItem) {
  const scope = item.scope;
  if (scope.type === "all") return "전체 공개";
  return cohorts.find((c) => c.id === scope.cohortId)?.label ?? scope.cohortId;
}

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function AdminContent({ initialItems }: { initialItems: ContentItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<ContentKind>("notice");
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const shown = useMemo(() => items.filter((i) => i.kind === tab), [items, tab]);
  const active = TABS.find((t) => t.key === tab)!;

  function reset() {
    setDraft(emptyDraft());
    setEditing(null);
    setOpen(false);
    setErr("");
  }

  function startEdit(item: ContentItem) {
    setDraft({
      title: item.title,
      body: item.body,
      scopeKey: item.scope.type === "all" ? "all" : item.scope.cohortId,
      category: item.category ?? NOTICE_CATEGORIES[0],
      pinned: Boolean(item.pinned),
      dueLabel: item.dueLabel ?? "",
      url: item.url ?? "",
    });
    setEditing(item.id);
    setOpen(true);
    setErr("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    const scope = draft.scopeKey === "all" ? { type: "all" } : { type: "cohort", cohortId: draft.scopeKey };
    const payload: Record<string, unknown> = {
      kind: tab,
      scope,
      title: draft.title,
      body: draft.body,
      pinned: tab === "notice" ? draft.pinned : false,
      category: tab === "notice" ? draft.category : undefined,
      dueLabel: draft.dueLabel,
      url: draft.url,
    };
    if (editing) payload.id = editing;

    const res = await fetch("/api/admin/content", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "저장하지 못했어요.");
      return;
    }
    const { item } = await res.json();
    setItems((list) => (editing ? list.map((i) => (i.id === item.id ? item : i)) : [item, ...list]));
    reset();
  }

  async function remove(item: ContentItem) {
    if (!window.confirm(`"${item.title}"을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const res = await fetch(`/api/admin/content?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (!res.ok) return;
    setItems((list) => list.filter((i) => i.id !== item.id));
  }

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={"btn sm" + (t.key === tab ? " v" : "")}
            onClick={() => { setTab(t.key); reset(); }}
          >
            {t.label} ({items.filter((i) => i.kind === t.key).length})
          </button>
        ))}
      </div>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--faint)" }}>{active.hint}</p>

      {!open && (
        <button className="btn v" style={{ marginBottom: 18 }} onClick={() => setOpen(true)}>
          <svg className="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          {active.label} 새로 작성
        </button>
      )}

      {open && (
        <form className="card" style={{ padding: 20, marginBottom: 22 }} onSubmit={save}>
          {err && <div className="err">{err}</div>}

          <div className="field">
            <label>누구에게 보일까요?</label>
            <select
              value={draft.scopeKey}
              onChange={(e) => setDraft({ ...draft, scopeKey: e.target.value })}
              style={{ padding: "11px 13px", border: "1px solid var(--border-2)", borderRadius: 11, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 14 }}
            >
              <option value="all">전체 공개 — 모든 수강생</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>{c.label} 전용</option>
              ))}
            </select>
          </div>

          {tab === "notice" && (
            <div className="field">
              <label>분류</label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                style={{ padding: "11px 13px", border: "1px solid var(--border-2)", borderRadius: 11, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 14 }}
              >
                {NOTICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          <div className="field">
            <label>제목</label>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required placeholder={`${active.label} 제목`} />
          </div>

          {tab === "assignment" && (
            <div className="field">
              <label>마감 안내 (선택)</label>
              <input value={draft.dueLabel} onChange={(e) => setDraft({ ...draft, dueLabel: e.target.value })} placeholder="예) 마감 10.12" />
            </div>
          )}

          {tab === "event" && (
            <div className="field">
              <label>일시·장소 (선택)</label>
              <input value={draft.dueLabel} onChange={(e) => setDraft({ ...draft, dueLabel: e.target.value })} placeholder="예) 10.09(목) 19:00 · 강남 라운지" />
            </div>
          )}

          {tab === "material" && (
            <div className="field">
              <label>자료 링크 (선택)</label>
              <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://…" />
            </div>
          )}

          <div className="field">
            <label>내용</label>
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={5}
              style={{ padding: "11px 13px", border: "1px solid var(--border-2)", borderRadius: 11, background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 14, resize: "vertical" }}
            />
          </div>

          {tab === "notice" && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 13.5 }}>
              <input type="checkbox" checked={draft.pinned} onChange={(e) => setDraft({ ...draft, pinned: e.target.checked })} />
              📌 상단에 고정하기
            </label>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn v" disabled={busy}>{busy ? "저장 중…" : editing ? "수정 저장" : "등록"}</button>
            <button type="button" className="btn" onClick={reset}>취소</button>
          </div>
        </form>
      )}

      <div className="card">
        {shown.length === 0 && (
          <p style={{ padding: 28, margin: 0, color: "var(--faint)", textAlign: "center" }}>
            아직 작성한 {active.label}이(가) 없어요.
          </p>
        )}
        {shown.map((item, i) => (
          <div
            key={item.id}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : undefined, flexWrap: "wrap" }}
          >
            <span className={"pill " + (item.scope.type === "all" ? "mint" : "v")}>{scopeLabel(item)}</span>
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>
                {item.pinned && <span style={{ color: "var(--warm-ink)", marginRight: 5 }}>📌</span>}
                {item.title}
              </p>
              <small style={{ color: "var(--faint)" }}>
                {item.category ? `${item.category} · ` : ""}
                {item.dueLabel ? `${item.dueLabel} · ` : ""}
                {item.createdBy} · {fmt(item.createdAt)}
                {item.updatedAt ? " (수정됨)" : ""}
              </small>
            </div>
            <button type="button" className="btn sm" onClick={() => startEdit(item)}>수정</button>
            <button type="button" className="btn sm" onClick={() => remove(item)}>삭제</button>
          </div>
        ))}
      </div>
    </>
  );
}
