import RouteSectionShell from './route/RouteSectionShell.jsx';

export default function InstagramCTA() {
  return (
    <RouteSectionShell id="instagram" label="Volgen" side="right">
      <h2 className="u-wide text-[clamp(22px,3vw,32px)] font-extrabold leading-[1] text-ink">
        Updates komen op Instagram
      </h2>
      <p className="mt-4 max-w-prose text-[17px] leading-[1.6]">
        Trainingen, deelnemers en het laatste nieuws over 14 november.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="https://www.instagram.com/mallrun0318"
          target="_blank"
          rel="noreferrer"
          className="u-narrow rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-ink hover:bg-brandInk hover:text-paper"
        >
          @mallrun0318
        </a>
        <a
          href="https://instagram.com/yfcveenendaal"
          target="_blank"
          rel="noreferrer"
          className="u-narrow rounded-full bg-panel px-6 py-3 text-[15px] font-semibold text-ink hover:bg-line"
        >
          @yfcveenendaal
        </a>
      </div>
    </RouteSectionShell>
  );
}
