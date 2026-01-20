import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import AuthSection from './AuthSection';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[linear-gradient(90deg,#141224_0%,#1a1f33_100%)] text-white shadow-[0_10px_30px_-22px_rgba(20,18,36,0.7)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-[0.28em] uppercase text-[var(--sport-red)] hover:text-white transition-colors"
        >
          GameHub
        </Link>

        <div className="flex items-center gap-8">
          <Navigation />
          <AuthSection />
        </div>
      </div>
      <div className="h-1 w-full bg-[linear-gradient(90deg,var(--sport-red),var(--sport-orange))]" />
    </header>
  );
}
