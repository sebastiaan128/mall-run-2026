import { Link, useParams } from 'react-router-dom';
import { useParticipants } from '../hooks/useParticipants.js';
import ProgressBar from '../components/ProgressBar.jsx';
import Footer from '../components/Footer.jsx';

export default function ParticipantPage() {
  const { id } = useParams();
  const { participants, loading } = useParticipants();
  const participant = participants.find((p) => p.id === id);
  const km = String(participant?.distance || '').replace(/\s*km\s*/i, '');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ink bg-base">
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-6 py-3.5 md:px-12 lg:px-16">
          <Link to="/" className="font-wordmark text-[17px] text-ink">
            The Mall Run
          </Link>
          <Link
            to="/#deelnemers"
            className="font-sans u-narrow text-[15px] font-medium text-body hover:text-muted"
          >
            Alle deelnemers
          </Link>
        </div>
      </header>

      {loading ? (
        <p className="flex-1 px-6 py-24 text-center text-[16px] text-muted">Laden…</p>
      ) : !participant ? (
        <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-24">
          <h1 className="u-wide text-[32px] font-black leading-[1]">
            Deze deelnemer bestaat niet meer
          </h1>
          <p className="mt-4 max-w-prose leading-[1.65]">
            De pagina is verwijderd of het adres klopt niet helemaal.
          </p>
          <Link
            to="/#deelnemers"
            className="mt-6 inline-block rounded-full bg-panel px-5 py-3 font-sans u-narrow text-[15px] font-semibold text-ink hover:bg-line"
          >
            Terug naar alle deelnemers
          </Link>
        </div>
      ) : (
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:py-24">
          {/* Startnummer: afstand groot, naam eronder, daarna de eigen stand. */}
          <div className="rounded-2xl border border-ink bg-paper">
            <div className="flex items-baseline justify-between border-b border-line px-7 pb-4 pt-6">
              <span className="u-wide text-[44px] font-black leading-none text-ink">
                {km}
                <span className="ml-1.5 font-sans text-[15px] font-medium text-muted">km</span>
              </span>
              <span className="font-sans u-narrow text-[15px] text-muted">
                {participant.team || 'Individueel'}
              </span>
            </div>
            <div className="px-7 py-8">
              <h1 className="u-wide text-[34px] font-black leading-[0.95] md:text-[48px]">
                {participant.name}
              </h1>
              {participant.quote && (
                <p className="mt-5 max-w-prose text-[19px] italic leading-[1.65]">
                  {participant.quote}
                </p>
              )}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="mb-6 font-sans u-narrow text-[15px] font-semibold text-ink">
              De stand van {participant.name.split(' ')[0]}
            </h2>
            <ProgressBar
              raised={participant.raisedAmount}
              goal={participant.goalAmount}
              size="sm"
            />
            <button
              type="button"
              className="mt-8 rounded-full bg-brand px-7 py-3.5 font-sans u-narrow text-[16px] font-bold text-ink hover:bg-brandInk hover:text-paper"
            >
              Steun {participant.name.split(' ')[0]}
            </button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
