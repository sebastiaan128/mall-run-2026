import RouteSectionShell from './route/RouteSectionShell.jsx';
import { useParticipants } from '../hooks/useParticipants.js';
import ParticipantCard from './ParticipantCard.jsx';

export default function ParticipantsSection() {
  const { participants, loading } = useParticipants();

  return (
    <RouteSectionShell id="deelnemers" label="Deelnemers">
      <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
        Wie er meelopen
      </h2>
      <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
        Iedereen loopt met een eigen doel. Open een deelnemer om het verhaal en de stand te zien.
      </p>

      {loading && <p className="mt-10 text-[16px] text-muted">Deelnemers worden geladen.</p>}

      {!loading && participants.length === 0 && (
        <p className="mt-10 max-w-prose text-[16px] text-muted">
          Er staat nog niemand aan de start. Deelnemers voeg je toe via het beheerscherm op{' '}
          <code>/admin</code>.
        </p>
      )}

      {participants.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {participants.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
        </div>
      )}

      <a
        href="#inschrijven"
        className="u-narrow mt-8 inline-block rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-ink hover:bg-brandInk hover:text-paper"
      >
        Doe ook mee
      </a>
    </RouteSectionShell>
  );
}
