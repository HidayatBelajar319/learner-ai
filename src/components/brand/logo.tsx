export default function Logo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="learner-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#learner-logo-grad)" />
      <path
        d="M32 18c-7.2 0-13 4.9-13 11 0 3.6 1.9 6.7 4.8 8.6.2 3.5 1.6 6.4 4.2 7.4v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c2.6-1 4-3.9 4.2-7.4C43.1 35.7 45 32.6 45 29c0-6.1-5.8-11-13-11zm-5 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm10 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
        fill="#fff"
      />
    </svg>
  );
}
