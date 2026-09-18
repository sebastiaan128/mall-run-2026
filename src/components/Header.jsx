import YfcLogo from './YfcLogo.jsx';

export default function Header() {
  const link = 'u-narrow text-[15px] font-medium text-body hover:text-brandInk';

  return (
    <header className="sticky top-0 z-50 bg-base/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        <div className="flex items-center gap-4">
          <a href="#top" className="font-wordmark text-[19px] tracking-[-0.01em] text-ink">
            The Mall Run
          </a>
          <span className="hidden h-6 w-px bg-line sm:block" />
          <a
            href="https://veenendaal.yfc.nl/"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2.5 sm:flex"
          >
            <span className="u-narrow text-[12px] leading-tight text-muted">
              een initiatief van
            </span>
            <YfcLogo className="h-7 w-auto" title="Youth for Christ Veenendaal" />
          </a>
        </div>

        <nav className="flex items-center gap-7">
          <a href="#waarom" className={`hidden sm:inline ${link}`}>Waarom</a>
          <a href="#deelnemers" className={`hidden sm:inline ${link}`}>Deelnemers</a>
          <a href="#route" className={`hidden sm:inline ${link}`}>Route</a>
          <a
            href="#inschrijven"
            className="u-narrow rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-ink hover:bg-brandInk hover:text-paper"
          >
            Inschrijven
          </a>
        </nav>
      </div>
    </header>
  );
}
