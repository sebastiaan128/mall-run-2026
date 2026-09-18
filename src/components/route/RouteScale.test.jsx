import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import RouteScale from './RouteScale.jsx';

function Harness({ stopCount }) {
  const containerRef = useRef(null);
  return (
    <div ref={containerRef}>
      {Array.from({ length: stopCount }, (_, i) => (
        <section key={i} id={`halte-${i}`} data-route-stop data-route-side="left" />
      ))}
      <RouteScale containerRef={containerRef} />
    </div>
  );
}

beforeEach(() => {
  // jsdom kent geen ResizeObserver en geen matchMedia: de hook heeft ze wel
  // nodig om te draaien, dus minimale mocks, net als bij de oude
  // useRouteLine-test.
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }));
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
});

// Een halte met een label erin, zodat te meten valt waar het streepje landt.
function LabelHarness() {
  const containerRef = useRef(null);
  return (
    <div ref={containerRef}>
      <section id="halte-0" data-route-stop data-route-side="left">
        <p data-route-label>De stand</p>
      </section>
      <RouteScale containerRef={containerRef} />
    </div>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('RouteScale', () => {
  it('zet het streepje naast het labeltje van de halte, niet op de sectierand', async () => {
    // jsdom rekent geen layout uit: alle rechthoeken zijn nul. Daarom geven we
    // de sectie en het label hier zelf maten, ver uit elkaar, zodat zichtbaar
    // is welke van de twee de hoogte van het streepje bepaalt.
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect() {
      if (this.hasAttribute('data-route-label')) return { top: 1200, height: 20 };
      return { top: 1000, height: 600 };
    });

    const { container } = render(<LabelHarness />);
    const tick = await waitFor(() => {
      const found = container.querySelector('[data-route-tick]');
      expect(found.style.top).not.toBe('');
      return found;
    });
    // Het midden van het label: 1200 + 20 / 2.
    expect(tick.style.top).toBe('1210px');
  });

  it('toont per halte een streepje met de bijbehorende kilometerstand', () => {
    const { container } = render(<Harness stopCount={3} />);
    const ticks = container.querySelectorAll('[data-route-tick]');
    expect(ticks).toHaveLength(3);
    const labels = Array.from(ticks).map((tick) => tick.textContent.trim());
    expect(labels).toEqual(['km 0', 'km 3,5', 'km 7']);
  });

  it('is decoratie: de overlay is aria-hidden', () => {
    const { container } = render(<Harness stopCount={3} />);
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
  });

  it('rendert zonder te klappen als er geen haltes zijn', () => {
    expect(() => render(<Harness stopCount={0} />)).not.toThrow();
    const { container } = render(<Harness stopCount={0} />);
    expect(container.querySelectorAll('[data-route-tick]')).toHaveLength(0);
  });
});
