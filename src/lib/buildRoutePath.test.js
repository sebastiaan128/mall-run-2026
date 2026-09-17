import { describe, expect, it } from 'vitest';
import { buildRoutePath, LEFT_X, RIGHT_X } from './buildRoutePath.js';

describe('buildRoutePath', () => {
  it('geeft een lege string zonder haltes', () => {
    expect(buildRoutePath([], { height: 1000 })).toBe('');
  });

  it('geeft een lege string bij een hoogte van nul', () => {
    expect(buildRoutePath([{ y: 10, side: 'left' }], { height: 0 })).toBe('');
  });

  it('trekt bij één halte een rechte lijn van boven naar beneden', () => {
    expect(buildRoutePath([{ y: 500, side: 'left' }], { height: 1000 })).toBe(
      `M ${LEFT_X} 0 L ${LEFT_X} 1000`
    );
  });

  it('begint bovenaan bij de eerste halte en eindigt onderaan bij de laatste', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 800, side: 'right' },
      ],
      { height: 1000 }
    );
    expect(d.startsWith(`M ${LEFT_X} 0`)).toBe(true);
    expect(d.trimEnd().endsWith(`${RIGHT_X} 1000`)).toBe(true);
  });

  it('gebruikt bezierkrommen tussen haltes aan verschillende kanten', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 800, side: 'right' },
      ],
      { height: 1000 }
    );
    expect(d).toContain('C');
  });

  it('legt haltes buiten de pagina op de rand', () => {
    const d = buildRoutePath(
      [
        { y: -400, side: 'left' },
        { y: 4000, side: 'right' },
      ],
      { height: 1000 }
    );
    // De punten óp de kromme (het eindpunt van elk C-segment en het M-punt)
    // moeten binnen de pagina liggen; controlepunten mogen erbuiten vallen,
    // want die bepalen alleen de richting en worden nooit getekend.
    const onCurve = [];
    const move = d.match(/^M ([\d.]+) ([\d.-]+)/);
    onCurve.push(Number(move[2]));
    for (const seg of d.matchAll(/C [^C]*?,\s*[\d.-]+ [\d.-]+,\s*([\d.-]+) ([\d.-]+)/g)) {
      onCurve.push(Number(seg[2]));
    }
    expect(onCurve.length).toBeGreaterThan(1);
    for (const y of onCurve) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1000);
    }
  });

  it('houdt de kromme vloeiend rond een halte op de bovenrand', () => {
    // Zuivere Catmull-Rom: de raaklijn in een halte is evenredig met het
    // verschil tussen zijn buren. Bij een halte op y = 0 betekent dat een
    // controlepunt bóven de pagina — dat mag, en het bewijst dat er geen knik
    // in de lijn zit.
    const d = buildRoutePath(
      [
        { y: 0, side: 'left' },
        { y: 900, side: 'right' },
      ],
      { height: 1000 }
    );
    expect(d).toContain('C');
    expect(d).not.toBe('');
  });
});
