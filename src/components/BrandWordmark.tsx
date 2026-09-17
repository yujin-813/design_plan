// 알테라(ALTERA) 스티커 로고.
// 두툼한 라운드 레터링을 두 번 겹쳐 그려서(뒤: 굵은 실루엣, 앞: 글자면)
// 스티커처럼 테두리가 둘러진 형태를 만듭니다.
export default function BrandWordmark({ width = 260, badges = true }: { width?: number; badges?: boolean }) {
  return (
    <svg className="wm-svg" width={width} viewBox="0 0 430 170" role="img" aria-label="알테라 ALTERA">
      <g transform="rotate(-4 215 85)">
        <text className="wm wm-back" x="34" y="116">altera</text>
        <text className="wm wm-face" x="34" y="116">altera</text>
      </g>

      {badges && (
        <>
          {/* 스파크 — AI */}
          <g transform="translate(316 30)">
            <circle className="wm-badge" r="26" fill="var(--warm)" />
            <path d="M0-12 3.2-3.2 12 0 3.2 3.2 0 12-3.2 3.2-12 0-3.2-3.2Z" fill="#fff" stroke="none" />
          </g>
          {/* 말풍선 — 커뮤니티 */}
          <g transform="translate(36 34)">
            <circle className="wm-badge" r="22" fill="var(--sky)" />
            <path d="M-10-7h20v13h-12l-6 5v-5h-2z" fill="#fff" stroke="none" />
          </g>
          {/* 성장 그래프 — 마케팅 */}
          <g transform="translate(360 122)">
            <circle className="wm-badge" r="23" fill="var(--mint)" />
            <path d="M-10 6 -3-2 2 3 10-7" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M4-8h7v7" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        </>
      )}
    </svg>
  );
}
