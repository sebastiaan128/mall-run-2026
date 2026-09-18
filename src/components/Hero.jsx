const LAPS = [
  { km: '7', rondes: 'één ronde' },
  { km: '14', rondes: 'twee rondes' },
  { km: '21,1', rondes: 'drie rondes' },
];

export default function Hero() {
  return (
    <section id="top" className="bg-base">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
        <p className="u-narrow text-[15px] font-semibold text-brandInk">
          Zaterdag 14 november 2026 · Veenendaal
        </p>

        <h1 className="font-wordmark mt-6 text-[clamp(48px,11vw,168px)] leading-[0.86] tracking-[-0.03em] text-ink">
          The Mall
          <br />
          Run 2026
        </h1>

        <p className="mt-10 max-w-prose text-[19px] leading-[1.6] text-body md:text-[21px]">
          Eén ronde door Veenendaal is zeven kilometer. Loop er één, twee of drie en haal met
          elke kilometer geld op voor jongerencentrum The Mall.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#inschrijven"
            className="u-narrow rounded-full bg-brand px-8 py-4 text-[15px] font-bold text-ink hover:bg-brandInk hover:text-paper"
          >
            Schrijf je in
          </a>
          <a
            href="#waarom"
            className="u-narrow rounded-full px-8 py-4 text-[15px] font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-brand"
          >
            Waarom we rennen
          </a>
        </div>

        <dl className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
          {LAPS.map((l) => (
            <div key={l.km}>
              <dt className="u-wide text-[clamp(40px,5vw,64px)] font-extrabold leading-none text-ink">
                {l.km}
                <span className="u-narrow ml-1.5 text-[14px] font-medium text-muted">km</span>
              </dt>
              <dd className="u-narrow mt-1 text-[14px] text-muted">{l.rondes}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
