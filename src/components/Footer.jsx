import YfcLogo from './YfcLogo.jsx';

export default function Footer() {
  const link = 'block text-[15px] text-white/70 hover:text-white';

  return (
    <footer className="bg-ink text-white/70 on-dark">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-wordmark text-[20px] text-white">The Mall Run</p>
            <p className="mt-3 text-[15px] leading-[1.6]">
              14 november 2026, Veenendaal.
            </p>
            <a
              href="https://veenendaal.yfc.nl/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block"
            >
              <YfcLogo variant="full" className="h-20 w-auto" title="Youth for Christ Veenendaal" />
            </a>
          </div>
          <div>
            <h2 className="u-narrow mb-3 text-[14px] font-semibold text-white">Contact</h2>
            <a href="mailto:info@yfcveenendaal.nl" className={link}>info@yfcveenendaal.nl</a>
            <a href="https://yfcveenendaal.nl" target="_blank" rel="noreferrer" className={link}>yfcveenendaal.nl</a>
          </div>
          <div>
            <h2 className="u-narrow mb-3 text-[14px] font-semibold text-white">Instagram</h2>
            <a href="https://www.instagram.com/mallrun0318" target="_blank" rel="noreferrer" className={link}>@mallrun0318</a>
            <a href="https://instagram.com/yfcveenendaal" target="_blank" rel="noreferrer" className={link}>@yfcveenendaal</a>
          </div>
          <div>
            <h2 className="u-narrow mb-3 text-[14px] font-semibold text-white">Meedoen</h2>
            <a href="#inschrijven" className={link}>Inschrijven</a>
            <a href="#deelnemers" className={link}>Deelnemers</a>
          </div>
        </div>

        <p className="mt-12 text-[13px] leading-[1.7] text-white/50">
          The Mall Run wordt georganiseerd door Youth for Christ Veenendaal, een ANBI-erkende
          organisatie. Giften zijn daardoor onder voorwaarden aftrekbaar van de belasting.
        </p>
        <p className="u-narrow mt-4 text-[13px] text-white/50">
          © 2026 The Mall Run, YFC Veenendaal
        </p>
      </div>
    </footer>
  );
}
