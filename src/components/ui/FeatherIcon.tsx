interface FeatherIconProps {
  // falls back to the inherited text color
  color?: string;
  className?: string;
}

const FeatherIcon = ({ color, className }: FeatherIconProps) => (
  <svg
    viewBox="3 8 72 72"
    fill="currentColor"
    className={className}
    style={{ color }}
    aria-hidden="true"
  >
    <path d="M52 9.2C63 9.2 73.6 16 73.6 28V33C73.6 38 72 41.5 69.5 43.3L59 46.8 65 47.2 64.6 50C63.6 53 61 55.3 58 56.2L45 59.8 52 60.2 51.8 62.5C47.5 66 41 69.7 37 69.8H18L10.85 77.65A4.6 4.6 0 0 1 4.35 71.15L38.5 37.2A.9 .9 0 0 0 37.3 36L14.25 59H12.3V46C12.3 41 15 36 19 31.5L34 16.5C39 11.5 44 9.2 52 9.2Z" />
  </svg>
);

export default FeatherIcon;
