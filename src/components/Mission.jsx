import RouteSectionShell from './route/RouteSectionShell.jsx';

export default function Mission() {
  return (
    <RouteSectionShell id="waarom" label="Waarom" tone="panel">
      <h2 className="u-wide text-[clamp(30px,5vw,52px)] font-extrabold leading-[0.95] text-ink">
        The Mall is er voor jongeren in Veenendaal
      </h2>

      <div className="mt-8 max-w-prose space-y-6 text-[18px] leading-[1.7]">
        <p>
          Een plek waar jongeren gezien worden, zichzelf kunnen zijn, anderen ontmoeten en kunnen
          groeien. Maar jongerenwerk is niet vanzelfsprekend: we ontvangen geen subsidie van de
          gemeente en draaien op donateurs en mensen die geloven in wat we doen.
        </p>
        <p>
          Onze droom is dat The Mall een plek blijft — en steeds meer wordt — waar jongeren in
          Veenendaal zich gezien, gehoord en geliefd weten.
        </p>
        <p>
          The Mall Run wordt georganiseerd door{' '}
          <a
            href="https://veenendaal.yfc.nl/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brandInk underline decoration-2 underline-offset-[5px]"
          >
            Youth for Christ Veenendaal
          </a>
          , de organisatie achter het jongerencentrum.
        </p>
      </div>

      <p className="u-wide mt-12 max-w-prose text-[21px] font-bold leading-[1.25] text-ink md:text-[27px]">
        Op 14 november komen we in beweging. Niet alleen voor de sport, maar om geld op te halen
        én The Mall zichtbaar te maken in Veenendaal.
      </p>
      <p className="u-narrow mt-4 text-[14px] text-muted">Het team van The Mall Run</p>
    </RouteSectionShell>
  );
}
