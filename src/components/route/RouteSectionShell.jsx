// Elke sectie is een halte aan de route. Geen kaders en geen raster meer: de
// sectie kiest een kant en krijgt daar zijn label, de rest is witruimte.
// `data-route-reached` wordt door useRouteLine gezet zodra de lijn hier is.

const TONE = {
  base: 'bg-base',
  panel: 'bg-panel',
  finish: 'bg-ink text-white/80 on-dark',
};

// De "bereikt"-kleur van het label is per achtergrond anders, want geen van
// de twee merkoranjes haalt overal 4,5:1: brandInk valt net onder de norm op
// bg-panel (4,39:1) en ruim onder op bg-ink (3,45:1); het lichtere brand valt
// juist door op bg-panel en bg-base. Beide blijven binnen de tokenset.
// De volledige klassenaam staat hieronder steeds letterlijk uitgeschreven
// (niet samengesteld uit een los kleurwoord): Tailwind scant bestanden op
// tekst, niet op uitgevoerde JS, dus een samengestelde klasse als
// `group-data-[...]:${kleur}` zou hij nooit genereren.
const REACHED_CLASS = {
  base: 'group-data-[route-reached=true]:text-brandInk',
  panel: 'group-data-[route-reached=true]:text-ink',
  finish: 'group-data-[route-reached=true]:text-brand',
};

export default function RouteSectionShell({
  id,
  label,
  side = 'left',
  tone = 'base',
  children,
}) {
  const right = side === 'right';
  const toneClass = TONE[tone] ?? TONE.base;
  const reachedClass = REACHED_CLASS[tone] ?? REACHED_CLASS.base;

  return (
    <section
      id={id}
      data-route-stop
      data-route-side={side}
      className={`group ${toneClass}`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10 md:py-28 lg:py-32">
        <p
          className={`u-narrow mb-8 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${
            tone === 'finish' ? 'text-white/50' : 'text-muted'
          } ${reachedClass} ${right ? 'md:text-right' : ''}`}
        >
          {label}
        </p>
        <div className={right ? 'md:ml-auto md:max-w-[62%]' : 'md:max-w-[62%]'}>{children}</div>
      </div>
    </section>
  );
}
