import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import SettingsTab from './SettingsTab.jsx';
import ParticipantsTab from './ParticipantsTab.jsx';
import RegistrationsTab from './RegistrationsTab.jsx';

const TABS = [
  { id: 'instellingen', label: 'Instellingen' },
  { id: 'deelnemers', label: 'Deelnemers' },
  { id: 'inschrijvingen', label: 'Inschrijvingen' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('instellingen');

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/20 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="u-wide text-lg text-white/60">MALL RUN</div>
          <div className="text-xs text-white/50">Beheer, {user?.email}</div>
        </div>
        <button
          onClick={logout}
          className="text-xs font-sans u-narrow font-bold text-white/60 hover:text-white"
        >
          Uitloggen
        </button>
      </header>

      <div className="px-8 py-8 max-w-5xl mx-auto">
        <nav className="flex gap-2 mb-8 border-b border-white/20">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 font-sans u-narrow font-bold text-sm border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-white text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'instellingen' && <SettingsTab />}
        {tab === 'deelnemers' && <ParticipantsTab />}
        {tab === 'inschrijvingen' && <RegistrationsTab />}
      </div>
    </div>
  );
}
