export default function Header() {
  const link = 'font-sans semiwide text-[15px] font-medium text-body hover:text-ink';

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-6 py-3.5 md:px-12 lg:px-16">
        <a href="#top" className="wide font-display text-[17px] font-black text-ink">
          MALL RUN
        </a>

        <nav className="flex items-center gap-7">
          <a href="#waarom" className={`hidden sm:inline ${link}`}>
            Waarom
          </a>
          <a href="#deelnemers" className={`hidden sm:inline ${link}`}>
            Deelnemers
          </a>
          <a href="#route" className={`hidden sm:inline ${link}`}>
            Route
          </a>
          <a
            href="#inschrijven"
            className="bg-accent px-4 py-2 font-sans semiwide text-[14px] font-semibold text-paper hover:bg-accentDeep"
          >
            Inschrijven
          </a>
        </nav>
      </div>
    </header>
  );
}
