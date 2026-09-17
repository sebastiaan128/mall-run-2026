import Section from './Section.jsx';

export default function Mission() {
  return (
    <Section id="waarom" label="Waarom">
      <h2 className="col-span-12 wide text-[34px] font-black leading-[0.92] md:col-span-8 md:text-[56px]">
        The Mall is er voor jongeren in Veenendaal
      </h2>

      <div className="col-span-12 mt-10 space-y-6 text-[18px] leading-[1.7] md:col-span-5 md:mt-14">
        <p>
          Een plek waar jongeren gezien worden, zichzelf kunnen zijn, anderen ontmoeten en kunnen
          groeien. Maar jongerenwerk is niet vanzelfsprekend: we ontvangen geen subsidie van de
          gemeente en draaien op donateurs en mensen die geloven in wat we doen.
        </p>
        <p>
          Onze droom is dat The Mall een plek blijft — en steeds meer wordt — waar jongeren in
          Veenendaal zich gezien, gehoord en geliefd weten.
        </p>
      </div>

      <div className="col-span-12 mt-8 bg-ink p-8 text-paper md:col-span-6 md:col-start-7 md:mt-14 md:p-11">
        <p className="wide font-display text-[21px] font-bold leading-[1.22] md:text-[27px]">
          Op 14 november komen we in beweging. Niet alleen voor de sport, maar om geld op te halen
          én The Mall zichtbaar te maken in Veenendaal.
        </p>
        <p className="mt-6 font-sans semiwide text-[14px] text-white/55">
          Het team van The Mall Run
        </p>
      </div>
    </Section>
  );
}
