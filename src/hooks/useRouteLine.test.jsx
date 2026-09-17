import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { useRouteLine } from './useRouteLine.js';

function Harness() {
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
      <section data-route-stop data-route-side="left">een</section>
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

beforeEach(() => {
  // jsdom kent `SVGPathElement` niet als losse globale: <path>-elementen komen
  // hier binnen als kale `SVGElement`. We patchen daarom `SVGElement.prototype`
  // (met een val op `SVGPathElement` mocht een toekomstige jsdom-versie die wel
  // bieden), zodat de hook niet stukvalt op de ontbrekende SVG-methodes.
  const proto = typeof SVGPathElement !== 'undefined' ? SVGPathElement.prototype : SVGElement.prototype;
  proto.getTotalLength = vi.fn().mockReturnValue(1000);
  proto.getPointAtLength = vi.fn().mockReturnValue({ x: 10, y: 20 });
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
    expect(container.querySelector('path').style.strokeDashoffset).toBe('0');
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
});
