import { describe, expect, it } from 'vitest';
import { buildRoutePath, routeColumns } from './buildRoutePath.js';

const WIDTH = 1000;
const { left: leftX, right: rightX } = routeColumns(WIDTH);

// Ontleedt een SVG-pad (alleen M/L/C, zoals buildRoutePath die genereert) in
// een lijst commando's met hun begin- en eindpunt. Onafhankelijk van de
// implementatie, zodat de tests hieronder de geometrie controleren en niet
// simpelweg de code naäpen.
function parsePath(d) {
  const tokens = d.match(/[MLC][^MLC]*/g) || [];
  const commands = [];
  let current = { x: 0, y: 0 };
  for (const token of tokens) {
    const cmd = token[0];
    const nums = token
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    if (cmd === 'M') {
      current = { x: nums[0], y: nums[1] };
      commands.push({ cmd, from: current, to: current });
    } else if (cmd === 'L') {
      const to = { x: nums[0], y: nums[1] };
      commands.push({ cmd, from: current, to });
      current = to;
    } else if (cmd === 'C') {
      const c1 = { x: nums[0], y: nums[1] };
      const c2 = { x: nums[2], y: nums[3] };
      const to = { x: nums[4], y: nums[5] };
      commands.push({ cmd, from: current, c1, c2, to });
      current = to;
    }
  }
  return commands;
}

// Bemonstert een commando op vaste tussenpunten: lineair voor L, met de
// standaard cubische-beziërformule voor C.
function sampleCommand(command, steps = 40) {
  const points = [];
  if (command.cmd === 'M') return points;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    if (command.cmd === 'L') {
      points.push({
        x: command.from.x + (command.to.x - command.from.x) * t,
        y: command.from.y + (command.to.y - command.from.y) * t,
      });
    } else {
      const mt = 1 - t;
      const x =
        mt ** 3 * command.from.x +
        3 * mt ** 2 * t * command.c1.x +
        3 * mt * t ** 2 * command.c2.x +
        t ** 3 * command.to.x;
      const y =
        mt ** 3 * command.from.y +
        3 * mt ** 2 * t * command.c1.y +
        3 * mt * t ** 2 * command.c2.y +
        t ** 3 * command.to.y;
      points.push({ x, y });
    }
  }
  return points;
}

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

  it('gebruikt een rechte lijn tussen haltes aan dezelfde kant', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 600, side: 'left' },
      ],
      { width: WIDTH, height: 1000 }
    );
    expect(d).not.toContain('C');
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

  it('gaat exact door elke halte', () => {
    const stops = [
      { y: 150, side: 'left' },
      { y: 450, side: 'right' },
      { y: 900, side: 'left' },
    ];
    const d = buildRoutePath(stops, { width: WIDTH, height: 1200 });
    const commands = parsePath(d);
    for (const stop of stops) {
      const x = stop.side === 'right' ? rightX : leftX;
      const hit = commands.some(
        (c) => Math.abs(c.to.x - x) < 0.05 && Math.abs(c.to.y - stop.y) < 0.05
      );
      expect(hit).toBe(true);
    }
  });

  it('heeft een verticale raaklijn aan weerszijden van elke bocht (geen knik)', () => {
    const d = buildRoutePath(
      [
        { y: 200, side: 'left' },
        { y: 500, side: 'right' },
        { y: 900, side: 'left' },
      ],
      { width: WIDTH, height: 1200 }
    );
    const commands = parsePath(d);
    const curves = commands.filter((c) => c.cmd === 'C');
    expect(curves.length).toBeGreaterThan(0);

    for (const curve of curves) {
      // Ingaande raaklijn bij het startpunt van de bocht: het eerste
      // controlepunt deelt zijn x met het startpunt (rechte lijn ervoor was
      // al verticaal, dus geen knik bij het overgaan in de bocht).
      expect(Math.abs(curve.c1.x - curve.from.x)).toBeLessThan(0.05);
      // Uitgaande raaklijn bij de halte zelf: het tweede controlepunt deelt
      // zijn x met het eindpunt, dus de raaklijn daar is ook verticaal.
      expect(Math.abs(curve.c2.x - curve.to.x)).toBeLessThan(0.05);
    }
  });

  it('blijft tussen de haltes op een van de twee kolommen, behalve vlak boven een halte', () => {
    // Dit is de kerntest van deze taak: zou iemand de vloeiende slinger door
    // alle haltes terugzetten, dan snijdt de lijn schuin door het midden van
    // de pagina en faalt deze test.
    const height = 2400;
    const stops = [
      { y: 150, side: 'left' },
      { y: 450, side: 'right' },
      { y: 900, side: 'left' },
      { y: 1300, side: 'right' },
      { y: 1750, side: 'left' },
      { y: 2100, side: 'right' },
    ];

    // Dezelfde bandformule als de opdracht beschrijft, onafhankelijk
    // uitgerekend uit de haltes: niet ontleend aan de implementatie.
    const bands = [];
    for (let i = 1; i < stops.length; i += 1) {
      if (stops[i].side !== stops[i - 1].side) {
        const b = Math.min(80, (stops[i].y - stops[i - 1].y) / 2);
        bands.push([stops[i].y - 2 * b, stops[i].y]);
      }
    }

    const d = buildRoutePath(stops, { width: WIDTH, height });
    const commands = parsePath(d);
    const tolerance = 0.5;
    let sampled = 0;

    for (const command of commands) {
      for (const point of sampleCommand(command)) {
        sampled += 1;
        const onLeft = Math.abs(point.x - leftX) < tolerance;
        const onRight = Math.abs(point.x - rightX) < tolerance;
        const inBand = bands.some(
          ([from, to]) => point.y >= from - tolerance && point.y <= to + tolerance
        );
        expect(onLeft || onRight || inBand).toBe(true);
      }
    }
    expect(sampled).toBeGreaterThan(100);
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
