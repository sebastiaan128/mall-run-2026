import { useEffect } from 'react';
import { drawnFraction, isStopReached } from '../lib/routeProgress.js';

// Dezelfde vorm als de oude useRouteLine, maar eenvoudiger: er wordt niets
// getekend, alleen een schaalverdeling gepositioneerd en een markering
// verplaatst. De hook schrijft per frame rechtstreeks naar de DOM en nooit
// naar React-state: state zou de hele pagina elke frame opnieuw laten
// renderen. In de tekenlus wordt niets gemeten — alle maten staan in de
// cache hieronder en worden alleen bij resize of boomwijziging opnieuw
// gevuld, in measure().
export function useRouteScale({ scaleRef, markerRef, containerRef }) {
  useEffect(() => {
    const scale = scaleRef?.current;
    const marker = markerRef?.current;
    const container = containerRef.current;
    if (!scale || !container) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cache = { height: 0, stops: [] };
    let frame = 0;
    let dirty = true;

    function measure() {
      const stopElements = Array.from(container.querySelectorAll('[data-route-stop]'));
      const height = container.scrollHeight;

      const stops = stopElements.map((element) => {
        const y = element.getBoundingClientRect().top + window.scrollY;
        const tick = scale.querySelector(`[data-route-tick="${element.id}"]`);
        if (tick) tick.style.top = `${y}px`;
        return { element, y };
      });

      cache = { height, stops };
    }

    function paint() {
      // Zonder haltes is er niets om te positioneren; een lege pagina moet
      // gewoon werken.
      if (!cache.stops.length) return;

      const fraction = drawnFraction(window.scrollY, window.innerHeight, cache.height);
      if (marker) {
        marker.style.top = `${cache.height * fraction}px`;
      }

      for (const stop of cache.stops) {
        const reached = isStopReached(stop.y, window.scrollY, window.innerHeight);
        stop.element.dataset.routeReached = reached ? 'true' : 'false';
      }
    }

    function paintStatic() {
      if (marker) marker.style.display = 'none';
      for (const stop of cache.stops) {
        stop.element.dataset.routeReached = 'true';
      }
    }

    function loop() {
      frame = window.requestAnimationFrame(loop);
      if (!dirty) return;
      dirty = false;
      paint();
    }

    function onScroll() {
      dirty = true;
    }

    function start() {
      measure();
      if (motion.matches) {
        paintStatic();
        return;
      }
      paint();
      window.addEventListener('scroll', onScroll, { passive: true });
      frame = window.requestAnimationFrame(loop);
    }

    function stop() {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function restart() {
      stop();
      start();
    }

    start();

    const observer = new ResizeObserver(() => {
      dirty = true;
      measure();
      if (motion.matches) paintStatic();
    });
    observer.observe(container);

    // De deelnemerslijst komt live uit Firestore binnen: secties kunnen ná de
    // eerste meting verschijnen of verdwijnen. Verandert daarbij de hoogte van
    // de container niet merkbaar, dan meldt de ResizeObserver niets, dus ook
    // op boomwijzigingen letten, niet alleen op de hoogte.
    const mutations = new MutationObserver(() => {
      dirty = true;
      measure();
      if (motion.matches) paintStatic();
    });
    // attributes: false is geen detail maar de kern: measure() en paint()
    // schrijven zelf attributen (data-route-reached, style.top). Zou de
    // observer ook op attributen letten, dan roept hij zichzelf eindeloos aan.
    mutations.observe(container, { childList: true, subtree: true, attributes: false });

    motion.addEventListener('change', restart);

    return () => {
      stop();
      observer.disconnect();
      mutations.disconnect();
      motion.removeEventListener('change', restart);
    };
  }, [scaleRef, markerRef, containerRef]);
}
