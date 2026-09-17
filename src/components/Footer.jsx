export default function Footer() {
  const link = 'block text-[15px] text-white/70 hover:text-white';

  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto w-full max-w-[1480px] px-6 py-14 md:px-12 lg:px-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-x-8">
          <div>
            <p className="wide font-display text-[20px] font-black text-white">MALL RUN</p>
            <p className="mt-3 text-[15px] leading-[1.6]">
              14 november 2026, Veenendaal. Een initiatief van YFC Veenendaal.
            </p>
          </div>
          <div>
            <h2 className="mb-3 font-sans semiwide text-[14px] font-semibold text-white">Contact</h2>
            <a href="mailto:info@yfcveenendaal.nl" className={link}>
              info@yfcveenendaal.nl
            </a>
            <a href="https://yfcveenendaal.nl" className={link}>
              yfcveenendaal.nl
            </a>
          </div>
          <div>
            <h2 className="mb-3 font-sans semiwide text-[14px] font-semibold text-white">Instagram</h2>
            <a href="https://instagram.com/themallrun" className={link}>
              @themallrun
            </a>
            <a href="https://instagram.com/yfcveenendaal" className={link}>
              @yfcveenendaal
            </a>
          </div>
          <div>
            <h2 className="mb-3 font-sans semiwide text-[14px] font-semibold text-white">Meedoen</h2>
            <a href="#inschrijven" className={link}>
              Inschrijven
            </a>
            <a href="#deelnemers" className={link}>
              Deelnemers
            </a>
          </div>
        </div>

        <p className="mt-12 border-t border-white/15 pt-6 font-sans text-[13px] text-white/50">
          © 2026 The Mall Run, YFC Veenendaal
        </p>
      </div>
    </footer>
  );
}
