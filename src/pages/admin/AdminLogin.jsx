import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    const dest = location.state?.from ?? '/admin';
    return <Navigate to={dest} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Inloggen mislukt. Controleer e-mailadres en wachtwoord.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="font-display wide text-xl text-white/60 mb-1 text-center">MALL RUN</div>
        <h1 className="text-white font-sans semiwide font-bold text-lg text-center mb-8">
          Inloggen beheer
        </h1>

        {error && (
          <div className="bg-white/5 border border-red-500/60 rounded p-3 mb-5 text-sm text-white">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block font-sans semiwide font-bold text-xs text-white/60 mb-2">
            E-mailadres
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded border border-white/20 bg-white/5 text-white text-sm focus:outline-2 focus:outline-white"
          />
        </div>
        <div className="mb-6">
          <label className="block font-sans semiwide font-bold text-xs text-white/60 mb-2">
            Wachtwoord
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded border border-white/20 bg-white/5 text-white text-sm focus:outline-2 focus:outline-white"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3.5 rounded bg-paper text-ink font-sans semiwide font-bold text-sm disabled:opacity-60"
        >
          {busy ? 'Bezig…' : 'Inloggen'}
        </button>
        <p className="text-center text-xs text-white/50 mt-6">
          Nog geen account? Maak er één aan via Firebase Authentication in de console.
        </p>
      </form>
    </div>
  );
}
