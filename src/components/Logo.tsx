// 사이드바·작은 자리에 쓰는 알테라 심볼.
// BrandWordmark의 a를 떼어 같은 스티커 방식(뒤: 굵은 실루엣, 앞: 글자면)으로 그리고
// AI를 뜻하는 스파크 배지를 붙였습니다. 아주 작을 때는 배지 안 스파크를 생략합니다.
export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg
      className="wm-svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="알테라"
      style={{ flex: "none" }}
    >
      <g transform="rotate(-8 32 34)">
        <text className="wm wm-mark-back" x="31" y="50" textAnchor="middle">a</text>
        <text className="wm wm-mark-face" x="31" y="50" textAnchor="middle">a</text>
      </g>
      <g transform="translate(50 14)">
        <circle className="wm-mark-badge" r="10" />
        {size >= 28 && <path d="M0-5 1.3-1.3 5 0 1.3 1.3 0 5-1.3 1.3-5 0-1.3-1.3Z" fill="#fff" />}
      </g>
    </svg>
  );
}
