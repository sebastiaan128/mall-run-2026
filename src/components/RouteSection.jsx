import Section from './Section.jsx';

const LAPS = [
  ['7 km', 'één ronde'],
  ['14 km', 'twee rondes'],
  ['21,1 km', 'drie rondes'],
];

export default function RouteSection() {
  return (
    <Section id="route" label="De route">
      <div className="col-span-12 flex aspect-[16/10] items-center justify-center border border-ink bg-paper md:col-span-7">
        <span className="font-sans semiwide text-[14px] font-semibold text-muted">
          Routekaart volgt
        </span>
      </div>

      <div className="col-span-12 mt-8 md:col-span-4 md:col-start-9 md:mt-0">
        <h2 className="wide text-[28px] font-black leading-[0.95] md:text-[40px]">
          Eén rondje Veenendaal
        </h2>
        <p className="mt-5 text-[17px] leading-[1.6]">
          De ronde is zeven kilometer lang en loopt door de stad, langs The Mall. Het exacte
          parcours en de starttijden maken we later dit jaar bekend.
        </p>
        <dl className="mt-8">
          {LAPS.map(([km, rondes]) => (
            <div key={km} className="flex items-baseline justify-between border-b border-rule py-3 first:border-t">
              <dt className="semiwide font-display text-[17px] font-bold text-ink">{km}</dt>
              <dd className="font-sans text-[15px] text-muted">{rondes}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
