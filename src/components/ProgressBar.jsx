const TICKS = [25, 50, 75];

function euro(n) {
  return '€' + Number(n || 0).toLocaleString('nl-NL');
}

// De teller zit in een capsule op de routelijn. De balk heeft een eigen, duidelijk
// begrensde vorm: de routelijn toont waar je bent op de pagina, deze balk toont
// wat er is opgehaald. Die twee mogen niet op elkaar lijken.
export default function ProgressBar({ raised, goal, stretch, size = 'lg' }) {
  const pct = goal > 0 ? Math.max(0, Math.min(100, (raised / goal) * 100)) : 0;
  const big = size === 'lg';

  return (
    <div className={`rounded-[28px] bg-panel ${big ? 'p-8 md:p-10' : 'p-6'}`}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          className={`u-wide font-extrabold leading-none text-ink ${
            big ? 'text-[clamp(40px,6vw,76px)]' : 'text-[32px]'
          }`}
        >
          {euro(raised)}
        </span>
        <span className="text-[16px] text-muted">opgehaald van {euro(goal)}</span>
      </div>

      <div
        className={`relative mt-6 overflow-hidden rounded-full bg-line ${big ? 'h-4' : 'h-2.5'}`}
        role="img"
        aria-label={`${euro(raised)} opgehaald van ${euro(goal)}, ${Math.round(pct)} procent`}
      >
        <div
          className="relative h-full rounded-full bg-brand transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        >
          {TICKS.filter((t) => t < pct).map((t) => (
            <span
              key={t}
              className="absolute top-0 h-full w-px bg-white/45"
              style={{ left: `${(t / pct) * 100}%` }}
            />
          ))}
        </div>
        {TICKS.filter((t) => t >= pct).map((t) => (
          <span
            key={t}
            className="absolute top-0 h-full w-px bg-ink/15"
            style={{ left: `${t}%` }}
          />
        ))}
      </div>

      <div className="u-narrow mt-3 flex flex-wrap justify-between gap-2 text-[13px] text-muted">
        <span>{Math.round(pct)}% van het doel</span>
        {stretch != null && <span>Lukt het? Dan gaan we door naar {euro(stretch)}</span>}
      </div>
    </div>
  );
}
