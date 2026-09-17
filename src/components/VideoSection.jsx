import Section from './Section.jsx';

export default function VideoSection() {
  return (
    <Section id="filmpje" label="In beeld">
      <div className="col-span-12 md:col-span-4">
        <h2 className="wide text-[28px] font-black leading-[0.95] md:text-[40px]">
          Ons verhaal in beeld
        </h2>
        <p className="mt-5 text-[17px] leading-[1.6]">
          We filmen dit najaar in The Mall, met de jongeren zelf. Zodra het klaar is staat het
          hier.
        </p>
      </div>
      <div className="col-span-12 mt-8 flex aspect-video items-center justify-center bg-deep md:col-span-7 md:col-start-6 md:mt-0">
        <div className="flex items-center gap-3">
          <svg width="15" height="17" viewBox="0 0 24 24" fill="#D93E11" aria-hidden="true">
            <path d="M6 4v16l14-8z" />
          </svg>
          <span className="font-sans semiwide text-[14px] font-semibold text-white/70">
            Filmpje volgt
          </span>
        </div>
      </div>
    </Section>
  );
}
