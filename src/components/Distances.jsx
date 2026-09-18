import RouteSectionShell from './route/RouteSectionShell.jsx';

const DISTANCES = [
  {
    km: '7',
    rondes: 'Eén ronde',
    desc: "Goed te doen met vrienden, familie of collega's. Ook als je pas net bent begonnen met hardlopen.",
  },
  {
    km: '14',
    rondes: 'Twee rondes',
    desc: 'De middenafstand. Genoeg uitdaging om voor te trainen, kort genoeg om vol te houden.',
  },
  {
    km: '21,1',
    rondes: 'Drie rondes',
    desc: 'De halve marathon. Dezelfde route, drie keer, tot het laatste stuk langs The Mall.',
  },
];

export default function Distances({ onChoose }) {
  return (
    <RouteSectionShell id="afstanden" label="Afstanden" side="right">
      <h2 className="u-wide text-[clamp(30px,5vw,52px)] font-extrabold leading-[0.95] text-ink">
        Eén ronde is zeven kilometer
      </h2>
      <p className="mt-6 max-w-prose text-[17px] leading-[1.6]">
        Hoe ver je gaat bepaal je zelf. De route is voor iedereen hetzelfde; je loopt hem één,
        twee of drie keer.
      </p>

      <ol className="mt-14 space-y-12">
        {DISTANCES.map((d) => (
          <li key={d.km}>
            <div className="flex items-baseline gap-4">
              <span className="u-wide text-[clamp(52px,7vw,96px)] font-extrabold leading-[0.85] text-brand">
                {d.km}
              </span>
              <span className="u-narrow text-[15px] text-muted">km · {d.rondes.toLowerCase()}</span>
            </div>
            <p className="mt-3 max-w-prose text-[17px] leading-[1.6]">{d.desc}</p>
            <a
              href="#inschrijven"
              onClick={() => onChoose(`${d.km} km`)}
              className="u-narrow mt-4 inline-block rounded-full bg-panel px-5 py-2.5 text-[14px] font-semibold text-ink hover:bg-brand"
            >
              Kies {d.km} km
            </a>
          </li>
        ))}
      </ol>
    </RouteSectionShell>
  );
}
