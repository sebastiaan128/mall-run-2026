import RouteSectionShell from './route/RouteSectionShell.jsx';

const LAPS = [
  ['7 km', 'één ronde'],
  ['14 km', 'twee rondes'],
  ['21,1 km', 'drie rondes'],
];

export default function RouteSection() {
  return (
    <RouteSectionShell id="route" label="De route">
      <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
        Eén rondje Veenendaal
      </h2>
      <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
        De ronde is zeven kilometer lang en loopt door de stad, langs The Mall. Het exacte
        parcours en de starttijden maken we later dit jaar bekend.
      </p>

      <div className="mt-8 flex aspect-[16/10] items-center justify-center rounded-[28px] bg-panel">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full p-6 text-brand"
          role="img"
          aria-label="Schematische weergave van de route: één ronde van zeven kilometer door Veenendaal"
        >
          <path
            d="M 93.44 26.56 L 64.97 4 L 52.59 26.51 L 5.54 96 L 80.41 45.94 L 94.46 25.86 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="u-narrow mt-3 text-[14px] text-muted">
        Indicatie van de vorm — bekijk de route op{' '}
        <a
          href="https://maps.app.goo.gl/YNn6QNxjEfno6tfGA"
          target="_blank"
          rel="noreferrer"
          className="text-brandInk underline"
        >
          Google Maps
        </a>
        .
      </p>

      <dl className="mt-8 max-w-sm">
        {LAPS.map(([km, rondes]) => (
          <div key={km} className="flex items-baseline justify-between py-3">
            <dt className="u-narrow text-[17px] font-bold text-ink">{km}</dt>
            <dd className="text-[15px] text-muted">{rondes}</dd>
          </div>
        ))}
      </dl>
    </RouteSectionShell>
  );
}
