"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { seed } from "@/lib/seed";
import type { PostView } from "@/lib/data";

export default function CommunityFeed({ posts }: { posts: PostView[] }) {
  const params = useSearchParams();
  const initial = params.get("cat");
  const [active, setActive] = useState(initial && seed.categories.includes(initial) ? initial : "전체");
  const filtered = active === "전체" ? posts : posts.filter((p) => p.cat === active);

  return (
    <>
      <div className="chtabs">
        {seed.categories.map((c) => (
          <div className={"chtab" + (c === active ? " on" : "")} key={c} onClick={() => setActive(c)}>
            # {c}
          </div>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 && (
          <p style={{ padding: "24px 18px", margin: 0, color: "var(--faint)", textAlign: "center" }}>
            아직 #{active} 글이 없어요. 첫 글을 남겨보세요!
          </p>
        )}
        {filtered.map((p) => (
          <Link className="thread" href={`/community/${p.id}`} key={p.id} style={{ cursor: "pointer" }}>
            <div className="av" style={{ background: p.color }}>{p.author.slice(0, 1)}</div>
            <div className="tb">
              <div className="m"><b>{p.author}</b>{p.cohort && <span className="pill v">{p.cohort}</span>}· #{p.cat} · {p.ago}</div>
              <h4>{p.title}</h4>
              <p className="ex">{p.excerpt}</p>
              <div className="rx">
                <span><svg className="ico" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-6 0v4H4l1 11h14l1-11z" /></svg>{p.likes}</span>
                <span className="pill mint">댓글 {p.comments}</span>
              </div>
            </div>
            <div className="st"><b>{p.views}</b><small>조회</small></div>
          </Link>
        ))}
      </div>
    </>
  );
}
