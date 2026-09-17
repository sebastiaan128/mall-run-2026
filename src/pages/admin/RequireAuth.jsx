import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// Routebewaker: stuurt niet-ingelogde bezoekers naar /admin/login.
// Let op: dit is UI-gemak, geen beveiliging op zich — de échte beveiliging
// zit in firestore.rules (alleen ingelogde gebruikers mogen schrijven).
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-white/60 text-sm">
        Laden…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
