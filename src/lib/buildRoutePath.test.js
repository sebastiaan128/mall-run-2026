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

  it('klemt haltes die buiten de pagina vallen', () => {
    const d = buildRoutePath(
      [
        { y: -400, side: 'left' },
        { y: 4000, side: 'right' },
      ],
      { height: 1000 }
    );
    expect(d).not.toContain('-');
    expect(d).not.toContain('4000');
  });
});
