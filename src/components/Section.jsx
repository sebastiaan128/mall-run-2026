/**
 * Elke sectie hangt aan de routelijn: een doorlopende verticale lijn in de
 * linkermarge van de pagina, met bij elke sectie een streepje en een label.
 * De inhoud staat in een 12-koloms raster zodat secties verschillend kunnen
 * uitlijnen. Op mobiel vervalt de lijn en staat het label boven de kop.
 */
export default function Section({ id, label, tone = 'light', children }) {
  const dark = tone === 'dark';
  const bg = dark
    ? 'bg-deep text-white/75 on-dark'
    : tone === 'paper'
      ? 'bg-paper'
      : 'bg-surface';

  return (
    <section id={id} className={bg}>
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-12 lg:px-16">
        <div className="md:grid md:grid-cols-[168px_1fr] lg:grid-cols-[220px_1fr]">
          <div
            className={`relative hidden md:block border-l ${
              dark ? 'border-white/25' : 'border-ink'
            }`}
          >
            <span
              className="absolute left-0 top-[6.9rem] h-px w-5 bg-accent"
            />
            <span
              className={`absolute left-9 top-[6.3rem] font-sans semiwide text-[13px] font-semibold ${
                dark ? 'text-white/60' : 'text-muted'
              }`}
            >
              {label}
            </span>
          </div>

          <div className="py-14 md:py-20 lg:py-24">
            <span
              className={`mb-3 block font-sans semiwide text-[13px] font-semibold md:hidden ${
                dark ? 'text-white/60' : 'text-muted'
              }`}
            >
              {label}
            </span>
            <div className="grid grid-cols-12 gap-x-6 lg:gap-x-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
