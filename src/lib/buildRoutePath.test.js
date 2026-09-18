import { describe, expect, it } from 'vitest';
import { buildRoutePath, routeColumns } from './buildRoutePath.js';

const WIDTH = 1000;
const { left: leftX, right: rightX } = routeColumns(WIDTH);

describe('buildRoutePath', () => {
  it('geeft een lege string zonder haltes', () => {
    expect(buildRoutePath([], { width: WIDTH, height: 1000 })).toBe('');
  });

  it('geeft een lege string bij een hoogte van nul', () => {
    expect(buildRoutePath([{ y: 10, side: 'left' }], { width: WIDTH, height: 0 })).toBe('');
  });

  it('geeft een lege string bij een breedte van nul', () => {
    expect(buildRoutePath([{ y: 10, side: 'left' }], { width: 0, height: 1000 })).toBe('');
  });

  it('trekt bij één halte een rechte lijn van boven naar beneden', () => {
    expect(
      buildRoutePath([{ y: 500, side: 'left' }], { width: WIDTH, height: 1000 })
    ).toBe(`M ${leftX} 0 L ${leftX} 1000`);
  });

  it('begint bovenaan bij de eerste halte en eindigt onderaan bij de laatste', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 800, side: 'right' },
      ],
      { width: WIDTH, height: 1000 }
    );
    expect(d.startsWith(`M ${leftX} 0`)).toBe(true);
    expect(d.trimEnd().endsWith(`${rightX} 1000`)).toBe(true);
  });

  it('gebruikt bezierkrommen tussen haltes aan verschillende kanten', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 800, side: 'right' },
      ],
      { width: WIDTH, height: 1000 }
    );
    expect(d).toContain('C');
  });

  it('legt haltes buiten de pagina op de rand', () => {
    const d = buildRoutePath(
      [
        { y: -400, side: 'left' },
        { y: 4000, side: 'right' },
      ],
      { width: WIDTH, height: 1000 }
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

  it('laat het controlepunt buiten de pagina uitsteken bij een halte op de bovenrand', () => {
    // Zuivere Catmull-Rom richt de raaklijn in een halte naar het verschil tussen
    // zijn buren. Ligt een halte op y = 0, dan wijst dat controlepunt omhoog, de
    // pagina uit. Dat is precies wat we willen: het controlepunt wordt nooit
    // getekend, maar houdt de kromme knikvrij.
    const d = buildRoutePath(
      [
        { y: 0, side: 'left' },
        { y: 900, side: 'right' },
      ],
      { width: WIDTH, height: 1000 }
    );
    const controlY = [...d.matchAll(/C ([\d.-]+) ([\d.-]+), ([\d.-]+) ([\d.-]+),/g)].flatMap(
      (m) => [Number(m[2]), Number(m[4])]
    );
    expect(controlY.length).toBeGreaterThan(0);
    expect(Math.min(...controlY)).toBeLessThan(0);
  });

  it('houdt de raaklijnen aan weerszijden van elke halte gelijk (geen knik)', () => {
    // C1-continuïteit: bij Catmull-Rom is de uitgaande raaklijn van een halte
    // gelijk aan de inkomende. Klemmen van controlepunten breekt dat — deze test
    // faalt dus op de oude implementatie.
    const d = buildRoutePath(
      [
        { y: 0, side: 'left' },
        { y: 500, side: 'right' },
        { y: 1000, side: 'left' },
      ],
      { width: WIDTH, height: 1000 }
    );
    const segments = [...d.matchAll(/C ([\d.-]+) ([\d.-]+), ([\d.-]+) ([\d.-]+), ([\d.-]+) ([\d.-]+)/g)]
      .map((m) => ({
        c2: { x: Number(m[3]), y: Number(m[4]) },
        end: { x: Number(m[5]), y: Number(m[6]) },
        c1: { x: Number(m[1]), y: Number(m[2]) },
      }));
    expect(segments.length).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < segments.length - 1; i += 1) {
      const anchor = segments[i].end;
      const incoming = { x: anchor.x - segments[i].c2.x, y: anchor.y - segments[i].c2.y };
      const outgoing = { x: segments[i + 1].c1.x - anchor.x, y: segments[i + 1].c1.y - anchor.y };
      // Afrondingsmarge: de padbouwer rondt op twee decimalen af.
      expect(Math.abs(incoming.x - outgoing.x)).toBeLessThan(0.05);
      expect(Math.abs(incoming.y - outgoing.y)).toBeLessThan(0.05);
    }
  });
});

describe('routeColumns', () => {
  it('houdt de lijn op een breed venster buiten de inhoudskolom', () => {
    const width = 1800;
    const content = Math.min(1200, width);
    const contentLeft = (width - content) / 2;
    const columns = routeColumns(width);
    expect(columns.left).toBeLessThan(contentLeft);
    expect(columns.right).toBeGreaterThan(contentLeft + content);
  });

  it('houdt de lijn op een smal venster binnen het venster', () => {
    const width = 320;
    const columns = routeColumns(width);
    expect(columns.left).toBeGreaterThanOrEqual(0);
    expect(columns.right).toBeLessThanOrEqual(width);
  });
});
