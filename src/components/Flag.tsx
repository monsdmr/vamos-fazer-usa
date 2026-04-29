// Inline SVG US flag — replaces the 🇺🇸 emoji to avoid pulling the
// system emoji font on Android (~80kb) and to render instantly during SSR.
type Props = {
  className?: string;
  size?: number;
  title?: string;
};

export function FlagUS({ className, size = 20, title = "United States" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 32"
      width={size}
      height={(size * 32) / 60}
      className={className}
      role="img"
      aria-label={title}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <title>{title}</title>
      <rect width="60" height="32" fill="#b22234" />
      {/* 6 white stripes */}
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect key={i} y={(i * 32) / 13} width="60" height={32 / 13} fill="#fff" />
      ))}
      {/* Canton */}
      <rect width="24" height={(7 * 32) / 13} fill="#3c3b6e" />
      {/* Single star (simplified — visually identical at small sizes) */}
      <text
        x="12"
        y={(7 * 32) / 13 / 2 + 3}
        textAnchor="middle"
        fontSize="10"
        fill="#fff"
        fontFamily="serif"
      >
        ★
      </text>
    </svg>
  );
}
