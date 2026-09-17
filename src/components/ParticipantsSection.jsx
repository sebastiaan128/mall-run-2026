import Section from './Section.jsx';
import { useParticipants } from '../hooks/useParticipants.js';
import ParticipantCard from './ParticipantCard.jsx';

export default function ParticipantsSection() {
  const { participants, loading } = useParticipants();

  return (
    <Section id="deelnemers" label="Deelnemers">
      <h2 className="col-span-12 wide text-[28px] font-black leading-[0.95] md:col-span-5 md:text-[40px]">
        Wie er meelopen
      </h2>
      <p className="col-span-12 mt-4 self-end text-[17px] leading-[1.6] md:col-span-4 md:col-start-7 md:mt-0">
        Iedereen loopt met een eigen doel. Open een startnummer om het verhaal en de stand te zien.
      </p>
      <div className="col-span-12 mt-6 md:col-span-2 md:col-start-11 md:mt-0 md:self-end md:text-right">
        <a
          href="#inschrijven"
          className="font-sans semiwide text-[15px] font-semibold text-ink underline decoration-rule underline-offset-[6px] hover:decoration-accent"
        >
          Doe ook mee
        </a>
      </div>

      {loading && (
        <p className="col-span-12 mt-12 border-t border-ink pt-6 text-[16px] text-muted">
          Deelnemers worden geladen.
        </p>
      )}

      {!loading && participants.length === 0 && (
        <p className="col-span-12 mt-12 border-t border-ink pt-6 text-[16px] text-muted">
          Er staat nog niemand aan de start. Deelnemers voeg je toe via het beheerscherm op{' '}
          <code className="font-sans">/admin</code>.
        </p>
      )}

      {participants.length > 0 && (
        <div className="col-span-12 mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {participants.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
        </div>
      )}
    </Section>
  );
}
