import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function AuthSection() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="icon-sm">
          <Link to={`/user/${username}`} aria-label="View profile">
            <User />
          </Link>
        </Button>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="icon-sm"
          aria-label="Log out"
        >
          <LogOut />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button variant="outline" size="sm">
          Login
        </Button>
      </Link>
      <Link to="/signup">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  );
}
