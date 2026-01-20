import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function AuthSection() {
  const { isAuthenticated, currentUserId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="sport-outline" size="icon-sm" className="rounded-full">
          <Link to={`/user/${currentUserId}`} aria-label="View profile">
            <User />
          </Link>
        </Button>
        <Button
          onClick={handleLogout}
          variant="sport-outline"
          size="icon-sm"
          aria-label="Log out"
          className="rounded-full"
        >
          <LogOut />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button variant="sport-outline" size="sm">
          Login
        </Button>
      </Link>
      <Link to="/signup">
        <Button variant="sport" size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
