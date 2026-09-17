const LAPS = [
  { km: '7', rondes: 'één ronde' },
  { km: '14', rondes: 'twee rondes' },
  { km: '21,1', rondes: 'drie rondes' },
];

export default function Hero() {
  return (
    <section id="top" className="bg-surface">
      <div className="mx-auto w-full max-w-[1480px] px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-16 lg:px-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <p className="font-sans semiwide text-[15px] font-semibold text-accent">
            Zaterdag 14 november 2026
          </p>
          <p className="font-sans semiwide text-[15px] text-muted">Start en finish in Veenendaal</p>
        </div>

        {/* De naam is het beeld: zo groot als de pagina toelaat, strak links. */}
        <h1 className="mt-7 wide text-[clamp(52px,13vw,212px)] font-black leading-[0.79] tracking-[-0.03em] text-ink">
          The Mall
          <br />
          Run 2026
        </h1>

        <div className="tick-rule mt-10 md:mt-14" />

        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-8">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="text-[19px] leading-[1.65] text-body md:text-[21px]">
              Eén ronde door Veenendaal is zeven kilometer. Loop er één, twee of drie en haal met
              elke kilometer geld op voor jongerencentrum The Mall.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#inschrijven"
                className="bg-accent px-7 py-3.5 font-sans semiwide text-[15px] font-bold text-paper hover:bg-accentDeep"
              >
                Schrijf je in
              </a>
              <a
                href="#waarom"
                className="border border-ink px-7 py-3.5 font-sans semiwide text-[15px] font-semibold text-ink hover:bg-paper"
              >
                Waarom we rennen
              </a>
            </div>
          </div>

          {/* De drie afstanden als meetlat, uitgelijnd op de rechtermarge. */}
          <dl className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            {LAPS.map((l) => (
              <div
                key={l.km}
                className="flex items-baseline justify-between gap-6 border-b border-rule py-3 first:border-t"
              >
                <dd className="font-sans semiwide text-[14px] text-muted">{l.rondes}</dd>
                <dt className="wide font-display text-[40px] font-black leading-none text-ink lg:text-[52px]">
                  {l.km}
                  <span className="ml-1.5 font-sans text-[14px] font-medium text-muted">km</span>
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
