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

      <div className="mt-8 aspect-[16/10] overflow-hidden rounded-[28px] bg-panel">
        <iframe
          title="Kaart van de route door Veenendaal"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?saddr=52.0260887,5.5307132&daddr=52.0305690,5.5215241+to:52.0260990,5.5175309+to:52.0123006,5.5023456+to:52.0222406,5.5265079+to:52.0262279,5.5310426&dirflg=w&output=embed"
        />
      </div>
      <p className="u-narrow mt-3 text-[14px] text-muted">
        De ronde van zeven kilometer. Bekijk de route op{' '}
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
