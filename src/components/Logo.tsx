// 사이드바·작은 자리에 쓰는 알테라 심볼. BrandWordmark와 같은 스티커 스타일입니다.
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
      <rect className="wm-mark" x="5" y="5" width="54" height="54" rx="19" />
      <text className="wm wm-mark-letter" x="32" y="47" textAnchor="middle">a</text>
    </svg>
  );
}
