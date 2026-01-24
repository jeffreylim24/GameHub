import { Link } from 'react-router-dom';

/**
 * Primary navigation links for the app header.
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
export default function Navigation() {
  const linkClassName =
    "relative text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[linear-gradient(90deg,var(--sport-red),var(--sport-orange))] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <nav className="flex items-center gap-6">
      <Link to="/" className={linkClassName}>
        Home
      </Link>
      <Link to="/topics" className={linkClassName}>
        Topics
      </Link>
    </nav>
  );
}
