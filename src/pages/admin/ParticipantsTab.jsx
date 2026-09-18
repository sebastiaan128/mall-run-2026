import { useState } from 'react';
import {
  useParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant,
} from '../../hooks/useParticipants.js';

const emptyForm = {
  name: '',
  distance: '7 km',
  team: 'Team Veenendaal',
  quote: '',
  raisedAmount: 0,
  goalAmount: 150,
};

export default function ParticipantsTab() {
  const { participants, loading } = useParticipants();
  const [editingId, setEditingId] = useState(null); // null = geen formulier open, 'new' = nieuwe deelnemer
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  function startNew() {
    setForm(emptyForm);
    setEditingId('new');
  }

  function startEdit(p) {
    setForm({
      name: p.name || '',
      distance: p.distance || '7 km',
      team: p.team || 'Team Veenendaal',
      quote: p.quote || '',
      raisedAmount: p.raisedAmount || 0,
      goalAmount: p.goalAmount || 150,
    });
    setEditingId(p.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId === 'new') {
        await addParticipant(form);
      } else {
        await updateParticipant(editingId, {
          ...form,
          raisedAmount: Number(form.raisedAmount) || 0,
          goalAmount: Number(form.goalAmount) || 0,
        });
      }
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Opslaan mislukt: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deze deelnemer verwijderen? Dit kan niet ongedaan gemaakt worden.')) return;
    try {
      await deleteParticipant(id);
    } catch (err) {
      console.error(err);
      alert('Verwijderen mislukt: ' + err.message);
    }
  }

  const fieldClass =
    'w-full px-3 py-2.5 rounded border border-white/20 bg-ink text-white text-sm focus:outline-2 focus:outline-white';
  const labelClass = 'block font-sans u-narrow font-bold text-xs text-white/60 mb-1.5';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-sans u-narrow font-bold text-lg">Deelnemers</h2>
        {editingId === null && (
          <button
            onClick={startNew}
            className="bg-paper text-ink px-4 py-2 rounded font-sans u-narrow font-bold text-xs"
          >
            + Nieuwe deelnemer
          </button>
        )}
      </div>

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/20 rounded p-6 mb-8 max-w-lg"
        >
          <h3 className="font-sans u-narrow font-bold text-sm text-white mb-4">
            {editingId === 'new' ? 'Nieuwe deelnemer' : 'Deelnemer bewerken'}
          </h3>

          <div className="mb-3">
            <label className={labelClass}>Naam</label>
            <input
              required
              className={fieldClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={labelClass}>Afstand</label>
              <select
                className={fieldClass}
                value={form.distance}
                onChange={(e) => setForm((f) => ({ ...f, distance: e.target.value }))}
              >
                <option>7 km</option>
                <option>14 km</option>
                <option>21,1 km</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Team</label>
              <input
                className={fieldClass}
                value={form.team}
                onChange={(e) => setForm((f) => ({ ...f, team: e.target.value }))}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className={labelClass}>Motivatiequote</label>
            <textarea
              rows={2}
              className={fieldClass}
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className={labelClass}>Opgehaald (€)</label>
              <input
                type="number"
                min="0"
                className={fieldClass}
                value={form.raisedAmount}
                onChange={(e) => setForm((f) => ({ ...f, raisedAmount: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Persoonlijk doel (€)</label>
              <input
                type="number"
                min="0"
                className={fieldClass}
                value={form.goalAmount}
                onChange={(e) => setForm((f) => ({ ...f, goalAmount: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="bg-paper text-ink px-5 py-2.5 rounded font-sans u-narrow font-bold text-xs disabled:opacity-60"
            >
              {busy ? 'Bezig…' : 'Opslaan'}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-5 py-2.5 rounded border border-white/20 text-white/60 font-sans u-narrow font-bold text-xs"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-white/50 text-sm">Laden…</p>
      ) : participants.length === 0 ? (
        <p className="text-white/50 text-sm">Nog geen deelnemers.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {participants.map((p) => (
            <div
              key={p.id}
              className="bg-white/5 border border-white/20 rounded p-4 flex items-center justify-between gap-4 flex-wrap"
            >
              <div>
                <div className="font-sans u-narrow font-bold text-white">{p.name}</div>
                <div className="text-xs text-white/60">
                  {p.distance} · {p.team} · €{p.raisedAmount || 0} van €{p.goalAmount || 0}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="text-xs font-sans u-narrow font-bold text-white"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs font-sans u-narrow font-bold text-red-400"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
