import Section from './Section.jsx';

export default function InstagramCTA() {
  return (
    <Section id="instagram" label="Volgen">
      <h2 className="col-span-12 wide text-[24px] font-black leading-[1] md:col-span-5 md:text-[32px]">
        Updates komen op Instagram
      </h2>
      <p className="col-span-12 mt-3 self-end text-[17px] leading-[1.6] md:col-span-3 md:col-start-6 md:mt-0">
        Trainingen, deelnemers en het laatste nieuws over 14 november.
      </p>
      <div className="col-span-12 mt-6 flex flex-wrap gap-3 md:col-span-4 md:col-start-9 md:mt-0 md:justify-end md:self-end">
        <a
          href="https://instagram.com/themallrun"
          target="_blank"
          rel="noreferrer"
          className="bg-accent px-5 py-3 font-sans semiwide text-[15px] font-semibold text-paper hover:bg-accentDeep"
        >
          @themallrun
        </a>
        <a
          href="https://instagram.com/yfcveenendaal"
          target="_blank"
          rel="noreferrer"
          className="border border-ink px-5 py-3 font-sans semiwide text-[15px] font-semibold text-ink hover:bg-paper"
        >
          @yfcveenendaal
        </a>
      </div>
    </Section>
  );
}
