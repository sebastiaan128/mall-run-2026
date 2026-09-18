import { useRef } from 'react';
import { useRouteLine } from '../../hooks/useRouteLine.js';

// De lijn wordt progressief onthuld als je scrollt: de oranje lijn die oplicht
// waar je bent. Het effect is één doorlopende lijn over de hele pagina.
//
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
  const markerRef = useRef(null);

  useRouteLine({ pathRef, markerRef, containerRef });

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
          className="stroke-brand"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute inset-0 mx-auto max-w-[1200px] px-6 md:px-10">
        <span
          ref={markerRef}
          className="absolute left-6 top-0 -mt-[5px] block h-2.5 w-2.5 rounded-full bg-brand md:left-10"
        />
      </div>
    </div>
  );
}

// De viewBox hierboven is alleen de beginwaarde: `useRouteLine`s `measure()`
// overschrijft hem meteen met de werkelijke paginahoogte.
