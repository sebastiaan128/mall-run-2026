import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ParticipantPage from './pages/ParticipantPage.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import RequireAuth from './pages/admin/RequireAuth.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/deelnemer/:id" element={<ParticipantPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-[#6B6B68] text-sm">
            Pagina niet gevonden.
          </div>
        }
      />
    </Routes>
  );
}
