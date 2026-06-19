function StarButton({
  domain,
  active,
  label,
  className = "",
  onClick,
}: {
  domain: string;
  active: boolean;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-domain={domain}
      data-action="favorite"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={`grid place-items-center rounded-full p-2 transition ${
        active ? "text-amber-500" : "text-slate-300 hover:text-amber-400"
      } ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79L1.58 7.62l5.82-.85L10 1.5z" />
      </svg>
    </button>
  );
}

export default StarButton;
