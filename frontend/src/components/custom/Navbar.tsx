import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import AuthSection from './AuthSection';

export default function Navbar() {
  return (
    <header className="border-b sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-80">
          <img src="/game-controller.png" alt="GameHub logo" className="h-8 w-8" />
          GameHub
        </Link>

        <div className="flex items-center gap-8">
          <Navigation />
          <AuthSection />
        </div>
      </div>
    </header>
  );
}
