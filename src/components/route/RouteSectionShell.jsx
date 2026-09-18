// Elke sectie is een halte aan de route. Geen kaders en geen raster meer: de
// sectie kiest een kant en krijgt daar zijn label, de rest is witruimte.
// `data-route-reached` wordt door useRouteLine gezet zodra de lijn hier is.

const TONE = {
  base: 'bg-base',
  panel: 'bg-panel',
  finish: 'bg-ink text-white/80 on-dark',
};

export default function RouteSectionShell({
  id,
  label,
  side = 'left',
  tone = 'base',
  children,
}) {
  const right = side === 'right';

  return (
    <section
      id={id}
      data-route-stop
      data-route-side={side}
      className={`group ${TONE[tone]}`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10 md:py-28 lg:py-32">
        <p
          className={`u-narrow mb-8 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${
            tone === 'finish' ? 'text-white/50' : 'text-muted'
          } group-data-[route-reached=true]:text-brandInk ${right ? 'md:text-right' : ''}`}
        >
          {label}
        </p>
        <div className={right ? 'md:ml-auto md:max-w-[62%]' : 'md:max-w-[62%]'}>{children}</div>
      </div>
    </section>
  );
}
