// Elke sectie is een halte aan de route. Geen kaders en geen raster meer: de
// sectie kiest een kant en krijgt daar zijn label, de rest is witruimte.
// `data-route-reached` wordt door useRouteLine gezet zodra de lijn hier is.

import { LEFT_X, RIGHT_X } from '../../lib/buildRoutePath.js';

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
      className={`group relative ${TONE[tone]}`}
    >
      <span
        aria-hidden="true"
        style={{ left: `${right ? RIGHT_X : LEFT_X}%` }}
        className={`absolute top-0 block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line transition-colors duration-500 group-data-[route-reached=true]:border-brand group-data-[route-reached=true]:bg-brand ${
          tone === 'finish' ? 'bg-ink' : 'bg-base'
        }`}
      />
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
