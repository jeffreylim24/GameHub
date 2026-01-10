import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="flex items-center gap-6">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      <Link to="/topics" className="hover:underline">
        Topics
      </Link>
    </nav>
  );
}
