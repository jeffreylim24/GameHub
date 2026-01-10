import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import AuthSection from './AuthSection';

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <Link to="/" className="text-2xl font-bold hover:opacity-80">
          GameHub
        </Link>

        {/* Right side: Navigation + Auth */}
        <div className="flex items-center gap-8">
          <Navigation />
          <AuthSection />
        </div>
      </div>
    </header>
  );
}
