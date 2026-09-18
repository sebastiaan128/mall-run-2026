import { useState } from 'react';
import { submitRegistration } from '../hooks/useRegistrations.js';

const DISTANCES = ['7 km', '14 km', '21,1 km'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  team: '',
  motivation: '',
  donationAmount: '',
};

export default function RegistrationForm({ distance, onDistanceChange }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitRegistration({ ...form, distance });
      setStatus('done');
      setForm(initialForm);
    } catch (err) {
      console.error('Inschrijving versturen mislukt:', err);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-[28px] bg-white/10 p-8">
        <p className="u-wide text-[24px] font-black leading-tight text-white">
          Je staat aan de start.
        </p>
        <p className="mt-3 max-w-prose leading-[1.65] text-white/75">
          We mailen je binnenkort de details over The Mall Run 2026: starttijd, route en hoe je
          jouw eigen deelnemerspagina krijgt.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-2xl border border-white/25 bg-white/5 px-4 py-3.5 text-[16px] text-white placeholder:text-white/35 hover:border-white/50';
  const labelClass = 'mb-2 block font-sans u-narrow text-[14px] font-semibold text-white/75';

  return (
    <form onSubmit={handleSubmit}>
      {status === 'error' && (
        <p className="mb-6 border-l-2 border-white bg-white/5 p-4 text-[15px] text-white">
          Versturen is niet gelukt. Probeer het nog eens, of mail ons op{' '}
          <a href="mailto:info@yfcveenendaal.nl" className="underline underline-offset-4">
            info@yfcveenendaal.nl
          </a>
          .
        </p>
      )}

      <div className="mb-5">
        <label className={labelClass} htmlFor="name">
          Naam
        </label>
        <input
          id="name"
          type="text"
          required
          placeholder="Voor- en achternaam"
          className={inputClass}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="email">
            E-mailadres
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="jij@email.nl"
            className={inputClass}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Telefoonnummer (optioneel)
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="06 12345678"
            className={inputClass}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>

      <fieldset className="mb-6">
        <legend className={labelClass}>Je afstand</legend>
        <div className="flex flex-wrap gap-3">
          {DISTANCES.map((d) => (
            <label key={d} className="relative cursor-pointer">
              <input
                type="radio"
                name="distance"
                value={d}
                checked={distance === d}
                onChange={() => onDistanceChange(d)}
                aria-label={d}
                className="pill-input peer"
              />
              <span className="u-narrow inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-[15px] font-semibold text-white/75 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white">
                {d}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mb-5">
        <label className={labelClass} htmlFor="team">
          Teamnaam (optioneel)
        </label>
        <input
          id="team"
          type="text"
          placeholder="bijv. Team Veenendaal"
          className={inputClass}
          value={form.team}
          onChange={(e) => update('team', e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label className={labelClass} htmlFor="motivation">
          Waarom loop jij mee? (optioneel)
        </label>
        <textarea
          id="motivation"
          rows={4}
          placeholder="Dit komt op je eigen deelnemerspagina te staan."
          className={`${inputClass} resize-y`}
          value={form.motivation}
          onChange={(e) => update('motivation', e.target.value)}
        />
      </div>

      <div className="mb-8">
        <label className={labelClass} htmlFor="donation">
          Eigen donatie in euro's (optioneel)
        </label>
        <input
          id="donation"
          type="number"
          min="0"
          step="5"
          placeholder="25"
          className={inputClass}
          value={form.donationAmount}
          onChange={(e) => update('donationAmount', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="u-narrow w-full rounded-full bg-brand py-4 text-[16px] font-bold text-ink hover:bg-brandInk hover:text-paper disabled:opacity-60"
      >
        {status === 'submitting' ? 'Bezig met versturen' : 'Schrijf me in'}
      </button>
    </form>
  );
}
