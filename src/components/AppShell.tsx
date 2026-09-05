"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

type Profile = { name: string; cohort: string; role: string; signedIn?: boolean };
type NavChild = { href: string; label: string };
type NavItem = { href: string; label: string; icon: JSX.Element; badge?: string; isNew?: boolean; children?: NavChild[] };

const groups: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      { href: "/", label: "홈", icon: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></> },
      { href: "/notices", label: "공지사항", badge: "3", icon: <><path d="M4 5h13v14H4z" /><path d="M17 8h3v9a2 2 0 01-2 2M7 9h7M7 13h7" /></> },
      { href: "/events", label: "이벤트", isNew: true, icon: <><path d="M3 8l9-5 9 5-9 5z" /><path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" /></> },
    ],
  },
  {
    label: "커뮤니티",
    items: [
      { href: "/community", label: "자유수다", icon: <><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></> },
      { href: "/news", label: "AI 뉴스", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></> },
    ],
  },
  {
    label: "콘텐츠",
    items: [
      { href: "/subscriptions", label: "구독", isNew: true, icon: <><path d="M4 4h16v16H4z" /><path d="M8 9h8M8 13h5" /><circle cx="17" cy="16" r="1.4" /></> },
      { href: "/scrap", label: "스크랩", isNew: true, icon: <><path d="M6 4h12v17l-6-4-6 4z" /></> },
    ],
  },
  {
    label: "교육 · 멘토링",
    items: [
      {
        href: "/my-courses", label: "내 수업", icon: <><path d="M4 5h13v14H4z" /><path d="M8 9h6M8 13h6" /></>,
        children: [
          { href: "/my-courses/notices", label: "공지보기" },
          { href: "/my-courses/materials", label: "자료실" },
          { href: "/my-courses/assignments", label: "과제확인" },
          { href: "/my-courses/schedule", label: "일정확인" },
        ],
      },
      { href: "/programs", label: "강의목록", icon: <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" /></> },
      { href: "/alumni", label: "취업정보", icon: <><path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" /><path d="M6 10v5c1 2 4 3 6 3s5-1 6-3v-5" /></> },
      { href: "/mentors", label: "멘토링 신청", icon: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M17 11l2 2 4-4" /></> },
    ],
  },
  {
    label: "문서",
    items: [
      { href: "/docs", label: "기획서", icon: <><path d="M4 4h13v15a2 2 0 002 2H6a2 2 0 01-2-2V4z" /><path d="M7 8h7M7 12h7M7 16h4" /></> },
    ],
  },
  {
    label: "계정",
    items: [
      { href: "/profile", label: "프로필", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></> },
    ],
  },
];

const crumbMap: Record<string, string> = {
  "/": "홈", "/notices": "공지사항", "/events": "이벤트", "/community": "자유수다",
  "/news": "AI 뉴스", "/subscriptions": "구독", "/scrap": "스크랩",
  "/my-courses": "내 수업", "/my-courses/notices": "공지보기", "/my-courses/materials": "자료실",
  "/my-courses/assignments": "과제확인", "/my-courses/schedule": "일정확인",
  "/programs": "강의목록", "/alumni": "취업정보", "/docs": "기획서",
  "/mentors": "멘토링 신청", "/profile": "프로필",
};

export default function AppShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({});
  const crumb = crumbMap[pathname] ?? "";
  const initial = (profile.name || "?").slice(0, 2);

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("arki-theme", next); } catch { /* ignore */ }
  }

  return (
    <div className={"app" + (open ? " open" : "")}>
      <div className="scrim" onClick={() => setOpen(false)} />
      <aside className="sidebar">
        <div className="brand">
          <Logo /><b>아르키</b>
        </div>
        <nav className="navwrap">
          {groups.map((g, gi) => (
            <div key={gi}>
              {g.label && <div className="glabel">{g.label}</div>}
              {g.items.map((it) => {
                const autoOpen = pathname === it.href || pathname.startsWith(it.href + "/");
                const isOpen = it.children ? (manualOpen[it.href] ?? autoOpen) : false;
                return (
                  <div key={it.href + it.label}>
                    <div className={"nav" + (pathname === it.href ? " active" : "")} style={{ padding: 0 }}>
                      <Link
                        href={it.href}
                        style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, padding: "9px 12px", minWidth: 0, color: "inherit" }}
                        onClick={() => setOpen(false)}
                      >
                        <svg className="ico" viewBox="0 0 24 24">{it.icon}</svg>
                        <span className="lbl">{it.label}</span>
                        {it.isNew && <span className="new">NEW</span>}
                        {it.badge && <span className="badge">{it.badge}</span>}
                      </Link>
                      {it.children && (
                        <button
                          type="button"
                          onClick={() => setManualOpen((m) => ({ ...m, [it.href]: !isOpen }))}
                          style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: "9px 12px", display: "grid", placeItems: "center" }}
                          aria-label="하위 메뉴 펼치기"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {it.children && isOpen && (
                      <div style={{ marginLeft: 30, marginBottom: 2 }}>
                        {it.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={"nav" + (pathname === c.href ? " active" : "")}
                            style={{ fontSize: 12.5, padding: "7px 12px" }}
                            onClick={() => setOpen(false)}
                          >
                            <span className="lbl">{c.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="su">
          <div className="av">{initial}</div>
          <div className="nm"><b>{profile.name}</b><small>{profile.cohort} · {profile.signedIn ? "멤버" : "게스트"}</small></div>
          <button onClick={toggleTheme} title="테마">
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></svg>
          </button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="burger" onClick={() => setOpen((v) => !v)}>
            <svg className="ico" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <div className="crumb">아르키 › <b>{crumb}</b></div>
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
            <input placeholder="검색…" />
          </div>
          <Link className="btn v" href="/community"><svg className="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>새 글</Link>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
