import { Link } from 'react-router-dom';

function euro(n) {
  return '€' + Number(n || 0).toLocaleString('nl-NL');
}

// De kaart is vormgegeven als een startnummer: kop met de afstand, naam groot,
// en onder de perforatielijn de stand van de inzameling.
export default function ParticipantCard({ participant }) {
  const pct =
    participant.goalAmount > 0
      ? Math.max(0, Math.min(100, (participant.raisedAmount / participant.goalAmount) * 100))
      : 0;
  const km = String(participant.distance || '').replace(/\s*km\s*/i, '');

  return (
    <Link
      to={`/deelnemer/${participant.id}`}
      className="group flex flex-col border border-ink bg-paper hover:bg-surface"
    >
      <div className="flex items-baseline justify-between border-b border-rule px-6 pb-3 pt-5">
        <span className="wide font-display text-[30px] font-black leading-none text-ink">
          {km}
          <span className="ml-1 font-sans text-[13px] font-medium text-muted">km</span>
        </span>
        {participant.team && (
          <span className="font-sans semiwide text-[13px] text-muted">{participant.team}</span>
        )}
      </div>

      <div className="grow px-6 py-6">
        <h3 className="semiwide text-[21px] font-bold leading-tight">{participant.name}</h3>
        {participant.quote && (
          <p className="mt-3 max-w-[34ch] text-[16px] italic leading-[1.6] text-body">
            {participant.quote}
          </p>
        )}
      </div>

      <div className="border-t border-dashed border-ink px-6 pb-5 pt-4">
        <div className="h-1.5 bg-rule">
          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2.5 font-sans semiwide text-[13px] text-muted">
          {euro(participant.raisedAmount)} van {euro(participant.goalAmount)}
        </p>
      </div>
    </Link>
  );
}
