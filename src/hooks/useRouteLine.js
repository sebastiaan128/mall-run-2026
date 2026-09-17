import { useEffect } from 'react';
import { buildRoutePath } from '../lib/buildRoutePath.js';
import { drawnFraction, isStopReached } from '../lib/routeProgress.js';

// De lijn wordt per frame bijgewerkt. Daarom schrijft deze hook rechtstreeks naar
// de DOM en nooit naar React-state: state zou de hele pagina elke frame opnieuw
// laten renderen. In de animatielus wordt niets gemeten — alle maten staan in de
// cache hieronder en worden alleen bij resize opnieuw gevuld.
export function useRouteLine({ pathRef, dotRef, containerRef }) {
  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    const container = containerRef.current;
    if (!path || !container) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cache = { length: 0, height: 0, stops: [] };
    let frame = 0;
    let dirty = true;

    function measure() {
      const stopElements = Array.from(container.querySelectorAll('[data-route-stop]'));
      const height = container.scrollHeight;

      const stops = stopElements.map((element) => ({
        element,
        y: element.getBoundingClientRect().top + window.scrollY,
        side: element.dataset.routeSide === 'right' ? 'right' : 'left',
      }));

      // De viewBox is 100 breed (relatief) en zo hoog als de pagina, zodat de
      // padbouwer gewoon in paginapixels kan rekenen. De optional chaining is
      // nodig omdat jsdom `ownerSVGElement` niet altijd kent.
      path.ownerSVGElement?.setAttribute('viewBox', `0 0 100 ${height}`);
      path.setAttribute('d', buildRoutePath(stops, { height }));
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);

      cache = { length, height, stops };
    }

    function paint() {
      const fraction = drawnFraction(window.scrollY, window.innerHeight, cache.height);
      path.style.strokeDashoffset = String(cache.length * (1 - fraction));

      if (dot) {
        const point = path.getPointAtLength(cache.length * fraction);
        dot.style.transform = `translate(${point.x}px, ${point.y}px)`;
      }

      for (const stop of cache.stops) {
        const reached = isStopReached(stop.y, window.scrollY, window.innerHeight);
        stop.element.dataset.routeReached = reached ? 'true' : 'false';
      }
    }

    function paintStatic() {
      path.style.strokeDashoffset = '0';
      if (dot) dot.style.display = 'none';
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
    motion.addEventListener('change', restart);

    return () => {
      stop();
      observer.disconnect();
      motion.removeEventListener('change', restart);
    };
  }, [pathRef, dotRef, containerRef]);
}
