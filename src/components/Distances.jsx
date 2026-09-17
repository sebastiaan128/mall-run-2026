import Section from './Section.jsx';

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
    <Section id="afstanden" label="Afstanden">
      <h2 className="col-span-12 wide text-[34px] font-black leading-[0.92] md:col-span-7 md:text-[56px]">
        Eén ronde is zeven kilometer
      </h2>
      <p className="col-span-12 self-end text-[17px] leading-[1.6] md:col-span-4 md:col-start-9">
        Hoe ver je gaat bepaal je zelf. De route is voor iedereen hetzelfde; je loopt hem één,
        twee of drie keer.
      </p>

      <ol className="col-span-12 mt-14">
        <li className="tick-rule" aria-hidden="true" />
        {DISTANCES.map((d, i) => (
          <li
            key={d.km}
            className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-ink py-8 lg:gap-x-8"
          >
            <div className="col-span-12 md:col-span-3">
              <span className="wide font-display text-[clamp(60px,8vw,124px)] font-black leading-[0.8] text-ink">
                {d.km}
              </span>
              <span className="ml-2 font-sans text-[15px] text-muted">km</span>
            </div>
            <div className="col-span-12 md:col-span-5 md:col-start-5">
              <h3 className="semiwide text-[19px] font-bold">{d.rondes}</h3>
              <p className="mt-2 max-w-prose text-[17px] leading-[1.6]">{d.desc}</p>
            </div>
            <div className="col-span-12 md:col-span-3 md:col-start-10 md:text-right">
              <a
                href="#inschrijven"
                onClick={() => onChoose(`${d.km} km`)}
                className="font-sans semiwide text-[15px] font-semibold text-ink underline decoration-rule underline-offset-[6px] hover:decoration-accent"
              >
                Kies {d.km} km
              </a>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
