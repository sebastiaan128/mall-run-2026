import { useEffect, useState } from 'react';
import { useCampaignSettings, updateCampaignSettings } from '../../hooks/useCampaignSettings.js';

export default function SettingsTab() {
  const { settings, loading } = useCampaignSettings();
  const [form, setForm] = useState(settings);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error

  useEffect(() => {
    if (!loading) setForm(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateCampaignSettings({
        raisedAmount: Number(form.raisedAmount) || 0,
        goalAmount: Number(form.goalAmount) || 0,
        stretchGoal: Number(form.stretchGoal) || 0,
      });
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  if (loading) return <p className="text-white/50 text-sm">Laden…</p>;

  const fieldClass =
    'w-full px-4 py-3 rounded border border-white/20 bg-white/5 text-white text-sm focus:outline-2 focus:outline-white';
  const labelClass = 'block font-sans semiwide font-bold text-xs text-white/60 mb-2';

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <h2 className="text-white font-sans semiwide font-bold text-lg mb-6">Campagne-instellingen</h2>

      <div className="mb-4">
        <label className={labelClass}>Opgehaald bedrag (€)</label>
        <input
          type="number"
          min="0"
          value={form.raisedAmount}
          onChange={(e) => setForm((f) => ({ ...f, raisedAmount: e.target.value }))}
          className={fieldClass}
        />
      </div>
      <div className="mb-4">
        <label className={labelClass}>Doelbedrag (€)</label>
        <input
          type="number"
          min="0"
          value={form.goalAmount}
          onChange={(e) => setForm((f) => ({ ...f, goalAmount: e.target.value }))}
          className={fieldClass}
        />
      </div>
      <div className="mb-6">
        <label className={labelClass}>Uitgebreid doel (€)</label>
        <input
          type="number"
          min="0"
          value={form.stretchGoal}
          onChange={(e) => setForm((f) => ({ ...f, stretchGoal: e.target.value }))}
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'saving'}
        className="bg-paper text-ink px-6 py-3 rounded font-sans semiwide font-bold text-sm disabled:opacity-60"
      >
        {status === 'saving' ? 'Opslaan…' : 'Opslaan'}
      </button>
      {status === 'saved' && <span className="ml-4 text-sm text-white">Opgeslagen ✓</span>}
      {status === 'error' && (
        <span className="ml-4 text-sm text-red-400">Opslaan mislukt, probeer opnieuw.</span>
      )}
    </form>
  );
}
