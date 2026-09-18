import { useEffect, useRef, useState } from 'react';
import { useRouteScale } from '../../hooks/useRouteScale.js';
import { stopKilometres } from '../../lib/routeProgress.js';

// De kilometerschaal staat waar de getekende routelijn stond: links in de
// kantlijn, buiten de tekstkolom. Anders dan de lijn hoeft hij niets te
// tekenen en niets te berekenen op basis van een pad: het is een vaste
// schaalverdeling met één bewegend onderdeel, de markering die aangeeft waar
// je bent.
//
// De secties zelf (RouteSectionShell) staan niet als props beschikbaar hier
// - ze worden ergens anders in de boom gerenderd - dus deze component
// ontdekt ze via containerRef, één keer na de eerste render. Dat is een
// gewone toestandsupdate (geen animatielus), dus geen probleem voor de
// "nooit naar React-state per frame"-regel die in de hook geldt.
//
// De schaal is decoratie: de betekenis zit in de tekst en het label dat
// oplicht in RouteSectionShell. Daarom aria-hidden en pointer-events-none,
// en op smalle schermen helemaal verborgen: onder md is er geen kantlijn om
// hem in te zetten.
export default function RouteScale({ containerRef }) {
  const scaleRef = useRef(null);
  const markerRef = useRef(null);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const elements = Array.from(container.querySelectorAll('[data-route-stop]'));
    const kilometres = stopKilometres(elements.length);
    setStops(elements.map((element, i) => ({ id: element.id, km: kilometres[i] })));
  }, [containerRef]);

  useRouteScale({ scaleRef, markerRef, containerRef });

  return (
    <div
      ref={scaleRef}
      className="pointer-events-none absolute inset-0 z-30 hidden md:block"
      aria-hidden="true"
      style={{ left: '28px' }}
    >
      <div className="absolute bottom-0 left-0 top-0 w-px bg-line" />

      {stops.map((stop) => (
        <div key={stop.id} data-route-tick={stop.id} className="absolute left-0 -mt-px">
          <span className="block h-px w-2.5 bg-line" />
          <span className="u-narrow absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] text-muted">
            km {String(stop.km).replace('.', ',')}
          </span>
        </div>
      ))}

      <span ref={markerRef} className="absolute left-0 -ml-[4.5px] -mt-[5px] block h-2.5 w-2.5 rounded-full bg-brand" />
    </div>
  );
}
