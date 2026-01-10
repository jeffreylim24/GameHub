import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function AuthSection() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Welcome, <strong>{username}</strong>
        </span>
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
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
