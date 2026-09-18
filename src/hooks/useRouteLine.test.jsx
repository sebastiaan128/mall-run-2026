import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { useRouteLine } from './useRouteLine.js';

function Harness() {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);
  useRouteLine({ pathRef, dotRef, markerRef, containerRef });
  return (
    <div ref={containerRef}>
      <svg>
        <path ref={pathRef} />
      </svg>
      <span ref={dotRef} />
      <span ref={markerRef} />
      <section data-route-stop data-route-side="left">een</section>
    </div>
  );
}

function HarnessZonderHaltes() {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const containerRef = useRef(null);
  useRouteLine({ pathRef, dotRef, containerRef });
  return (
    <div ref={containerRef}>
      <svg>
        <path ref={pathRef} />
      </svg>
      <span ref={dotRef} />
    </div>
  );
}

function mockMatchMedia(reduced) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

// jsdom kent `SVGPathElement` niet als losse globale: <path>-elementen komen
// hier binnen als kale `SVGElement`. We patchen daarom `SVGElement.prototype`
// (met een val op `SVGPathElement` mocht een toekomstige jsdom-versie die wel
// bieden), zodat de hook niet stukvalt op de ontbrekende SVG-methodes.
function svgProto() {
  return typeof SVGPathElement !== 'undefined' ? SVGPathElement.prototype : SVGElement.prototype;
}

beforeEach(() => {
  const proto = svgProto();
  // vi.spyOn (in plaats van een kale toewijzing) is nodig zodat
  // vi.restoreAllMocks() in afterEach de methodes ook echt kan terugdraaien.
  // De methodes bestaan niet op het prototype in jsdom; spyOn heeft iets om te
  // vervangen nodig, dus zetten we eerst een no-op neer.
  if (!proto.getTotalLength) proto.getTotalLength = () => 0;
  if (!proto.getPointAtLength) proto.getPointAtLength = () => ({ x: 0, y: 0 });
  vi.spyOn(proto, 'getTotalLength').mockReturnValue(1000);
  vi.spyOn(proto, 'getPointAtLength').mockReturnValue({ x: 10, y: 20 });
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useRouteLine', () => {
  it('tekent de lijn meteen volledig bij reduce motion', () => {
    mockMatchMedia(true);
    const { container } = render(<Harness />);
    const [line] = container.querySelectorAll('path');
    expect(line.style.strokeDashoffset).toBe('0');
  });

  it('verbergt het bolletje in de kantlijn bij reduce motion', () => {
    mockMatchMedia(true);
    const { container } = render(<Harness />);
    const [, marker] = container.querySelectorAll('span');
    expect(marker.style.display).toBe('none');
  });

  it('activeert alle haltes bij reduce motion', () => {
    mockMatchMedia(true);
    const { container } = render(<Harness />);
    expect(container.querySelector('[data-route-stop]')).toHaveAttribute(
      'data-route-reached',
      'true'
    );
  });

  it('luistert passief naar scroll als beweging is toegestaan', () => {
    mockMatchMedia(false);
    const spy = vi.spyOn(window, 'addEventListener');
    render(<Harness />);
    const scrollCall = spy.mock.calls.find(([event]) => event === 'scroll');
    expect(scrollCall?.[2]).toEqual({ passive: true });
  });

  it('ruimt de scroll-listener op bij unmount', () => {
    mockMatchMedia(false);
    const spy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Harness />);
    unmount();
    expect(spy.mock.calls.some(([event]) => event === 'scroll')).toBe(true);
  });

  it('crasht niet als er geen haltes op de pagina staan', () => {
    mockMatchMedia(false);
    // Zonder haltes tekent buildRoutePath niets: het d-attribuut blijft leeg
    // en de browser geeft dan `getTotalLength() === 0` en gooit een
    // InvalidStateError op `getPointAtLength`. Dat bootsen we hier na.
    const proto = svgProto();
    vi.spyOn(proto, 'getTotalLength').mockReturnValue(0);
    vi.spyOn(proto, 'getPointAtLength').mockImplementation(() => {
      throw new DOMException("The element's path is empty.", 'InvalidStateError');
    });
    expect(() => render(<HarnessZonderHaltes />)).not.toThrow();
  });

  it('pikt een halte op die pas ná de eerste meting aan de pagina wordt toegevoegd', async () => {
    mockMatchMedia(false);
    const { container } = render(<HarnessZonderHaltes />);

    // De deelnemerslijst komt live uit Firestore: secties kunnen dus pas na de
    // eerste meting verschijnen. Dat bootsen we hier na door zelf, buiten
    // React om, een halte aan de container toe te voegen.
    const stop = document.createElement('section');
    stop.setAttribute('data-route-stop', '');
    stop.setAttribute('data-route-side', 'left');
    container.querySelector('div').appendChild(stop);

    await waitFor(() => {
      expect(stop).toHaveAttribute('data-route-reached');
    });
  });
});
