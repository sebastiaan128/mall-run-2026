const TICKS = [25, 50, 75];

function euro(n) {
  return '€' + Number(n || 0).toLocaleString('nl-NL');
}

// De balk is getekend als een stuk weg: rechte hoeken, zwarte omlijning en
// kwartstreepjes. `stretch` is optioneel — alleen de hoofdcampagne heeft een
// uitbreidingsdoel, een individuele deelnemer niet.
export default function ProgressBar({ raised, goal, stretch, size = 'lg' }) {
  const pct = goal > 0 ? Math.max(0, Math.min(100, (raised / goal) * 100)) : 0;
  const big = size === 'lg';

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          className={`wide font-display font-black leading-none text-ink ${
            big ? 'text-[clamp(44px,6vw,84px)]' : 'text-[34px]'
          }`}
        >
          {euro(raised)}
        </span>
        <span className="text-[16px] text-muted">opgehaald van {euro(goal)}</span>
      </div>

      <div
        className={`relative mt-6 border border-ink ${big ? 'h-7' : 'h-4'}`}
        role="img"
        aria-label={`${euro(raised)} opgehaald van ${euro(goal)}, ${Math.round(pct)} procent`}
      >
        <div
          className="relative h-full overflow-hidden bg-accent transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        >
          {/* Over het gevulde deel staan de kwartstreepjes licht, zodat het
              oranje als één doorlopende lengte blijft lezen. */}
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
            className="absolute top-0 h-full w-px bg-ink/25"
            style={{ left: `${t}%` }}
          />
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap justify-between gap-2 font-sans semiwide text-[13px] text-muted">
        <span>{Math.round(pct)}% van het doel</span>
        {stretch != null && <span>Lukt het? Dan gaan we door naar {euro(stretch)}</span>}
      </div>
    </div>
  );
}
