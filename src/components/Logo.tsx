export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.29,
        background: "var(--violet)",
        display: "grid",
        placeItems: "center",
        flex: "none",
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <path d="M4 5h16v11H9l-5 4V5z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="9" cy="10.5" r="1" fill="#fff" />
        <circle cx="12.5" cy="10.5" r="1" fill="#fff" />
        <circle cx="16" cy="10.5" r="1" fill="#fff" />
      </svg>
    </div>
  );
}
