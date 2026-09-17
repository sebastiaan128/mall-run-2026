import { describe, expect, it } from 'vitest';
import { ARRIVAL_RATIO, drawnFraction, isStopReached } from './routeProgress.js';

describe('drawnFraction', () => {
  it('is bovenaan de pagina al een stukje getekend', () => {
    // De punt van de lijn staat op 60% van het scherm, dus bij scrollpositie 0
    // is er al 600 / 4000 getekend.
    expect(drawnFraction(0, 1000, 4000)).toBeCloseTo(0.15);
  });

  it('is 1 als de punt de onderkant bereikt', () => {
    expect(drawnFraction(3400, 1000, 4000)).toBe(1);
  });

  it('klemt een negatieve scrollpositie (rubber-band op iOS)', () => {
    expect(drawnFraction(-800, 1000, 4000)).toBe(0);
  });

  it('is 1 als de pagina korter is dan het scherm', () => {
    expect(drawnFraction(0, 1000, 600)).toBe(1);
  });

  it('is 1 als zowel de pagina als het scherm nul hoog zijn', () => {
    // Dit is het geval waarvoor de guard bestaat: zonder hem wordt 0 / 0 hier
    // NaN, en NaN overleeft clamp01. Een scherm van nul hoogte komt voor in een
    // verborgen iframe of vlak voor de eerste meting.
    expect(drawnFraction(0, 0, 0)).toBe(1);
  });
});

describe('isStopReached', () => {
  it('is bereikt zodra de halte boven de aankomstlijn staat', () => {
    expect(isStopReached(500, 0, 1000)).toBe(true);
  });

  it('is precies op de aankomstlijn bereikt', () => {
    // Letterlijke getallen, geen ARRIVAL_RATIO: anders toetst de test zichzelf.
    // Bij een scherm van 1000px ligt de aankomstlijn op 600px.
    expect(isStopReached(600, 0, 1000)).toBe(true);
  });

  it('is één pixel onder de aankomstlijn nog niet bereikt', () => {
    expect(isStopReached(601, 0, 1000)).toBe(false);
  });

  it('is nog niet bereikt als de halte eronder staat', () => {
    expect(isStopReached(900, 0, 1000)).toBe(false);
  });
});
