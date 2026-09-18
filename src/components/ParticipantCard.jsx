import { Link } from 'react-router-dom';

function euro(n) {
  return '€' + Number(n || 0).toLocaleString('nl-NL');
}

// Geen omkaderde kaart meer: een rij aan de route, met de afstand als aanloop en
// een kort streepje voortgang eronder.
export default function ParticipantCard({ participant }) {
  const pct =
    participant.goalAmount > 0
      ? Math.max(0, Math.min(100, (participant.raisedAmount / participant.goalAmount) * 100))
      : 0;
  const km = String(participant.distance || '').replace(/\s*km\s*/i, '');

  return (
    <Link
      to={`/deelnemer/${participant.id}`}
      className="group block rounded-[24px] px-5 py-6 hover:bg-panel"
    >
      <div className="flex items-baseline gap-4">
        <span className="u-wide text-[34px] font-extrabold leading-none text-brand">{km}</span>
        <span className="u-narrow text-[13px] text-muted">km</span>
        {participant.team && (
          <span className="u-narrow ml-auto text-[13px] text-muted">{participant.team}</span>
        )}
      </div>

      <h3 className="u-narrow mt-3 text-[21px] font-bold leading-tight text-ink">
        {participant.name}
      </h3>
      {participant.quote && (
        <p className="mt-2 max-w-[42ch] text-[16px] leading-[1.6] text-body">{participant.quote}</p>
      )}

      <div aria-hidden="true" className="mt-4 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="u-narrow mt-2 text-[13px] text-muted">
        {euro(participant.raisedAmount)} van {euro(participant.goalAmount)}
      </p>
    </Link>
  );
}
