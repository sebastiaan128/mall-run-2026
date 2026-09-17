import { useRef } from 'react';
import { useRouteLine } from '../../hooks/useRouteLine.js';

// De lijn ligt BOVEN de sectie-achtergronden (z-30): elke sectie krijgt straks
// een eigen achtergrondkleur (bg-base, bg-panel, bg-ink) die de lijn anders
// volledig zou afdekken — terwijl de lijn juist het dragende idee van de
// pagina is. De sticky header staat op z-50 en blijft daarmee erboven.
//
// De SVG scrollt met de pagina mee (position: absolute over de volle hoogte
// van de — relative geplaatste — pagina-container), in plaats van vast te
// blijven staan in de viewport (wat position: fixed zou doen).
//
// De lijn is decoratie: de betekenis zit in de tekstvolgorde, dus hij is
// volledig verborgen voor schermlezers. preserveAspectRatio="none" rekt de
// viewBox op; de lijndikte blijft gelijk dankzij vector-effect.
export default function RouteLine({ containerRef }) {
  const pathRef = useRef(null);
  const dotRef = useRef(null);

  useRouteLine({ pathRef, dotRef, containerRef });

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="#E85812"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[7px] -mt-[7px] block h-3.5 w-3.5 rounded-full bg-brand"
      />
    </div>
  );
}

// De viewBox hierboven is alleen de beginwaarde: `useRouteLine`s `measure()`
// overschrijft hem meteen met de werkelijke paginahoogte.
