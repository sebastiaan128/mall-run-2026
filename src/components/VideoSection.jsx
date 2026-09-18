import RouteSectionShell from './route/RouteSectionShell.jsx';

export default function VideoSection() {
  return (
    <RouteSectionShell id="filmpje" label="In beeld" side="right">
      <h2 className="u-wide text-[clamp(26px,4vw,40px)] font-extrabold leading-[0.95] text-ink">
        Ons verhaal in beeld
      </h2>
      <p className="mt-5 max-w-prose text-[17px] leading-[1.6]">
        We filmen dit najaar in The Mall, met de jongeren zelf. Zodra het klaar is staat het hier.
      </p>
      <div className="mt-8 flex aspect-video items-center justify-center rounded-[28px] bg-panel">
        <div className="flex items-center gap-3">
          <svg
            width="15"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-brand"
            aria-hidden="true"
          >
            <path d="M6 4v16l14-8z" />
          </svg>
          <span className="u-narrow text-[14px] font-semibold text-muted">Filmpje volgt</span>
        </div>
      </div>
    </RouteSectionShell>
  );
}
