import { describe, expect, it } from 'vitest';
import colors from './colors.js';
import { contrastRatio } from '../lib/contrast.js';

describe('contrastRatio', () => {
  it('is 21 voor zwart op wit', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });

  it('is 1 voor een kleur op zichzelf', () => {
    expect(contrastRatio('#E85812', '#E85812')).toBeCloseTo(1, 5);
  });
});

describe('kleurtokens', () => {
  it('gebruikt het oranje van Youth for Christ', () => {
    expect(colors.brand).toBe('#E85812');
  });

  it('laat asfaltzwarte tekst op oranje toe', () => {
    expect(contrastRatio(colors.ink, colors.brand)).toBeGreaterThanOrEqual(4.5);
  });

  it('verbiedt witte tekst op oranje', () => {
    // Deze staat er als vastlegging: wit op brand haalt de norm niet, en daarom
    // krijgen oranje knoppen zwarte tekst.
    expect(contrastRatio(colors.paper, colors.brand)).toBeLessThan(4.5);
  });

  it('laat wit op het diepe oranje wel toe', () => {
    expect(contrastRatio(colors.paper, colors.brandInk)).toBeGreaterThanOrEqual(4.5);
  });

  it('heeft leesbare lopende tekst op de achtergrond', () => {
    expect(contrastRatio(colors.body, colors.base)).toBeGreaterThanOrEqual(4.5);
  });

  it('heeft leesbare bijschriften op de achtergrond', () => {
    expect(contrastRatio(colors.muted, colors.base)).toBeGreaterThanOrEqual(4.5);
  });

  it('heeft kleine oranje tekst die de norm haalt', () => {
    expect(contrastRatio(colors.brandInk, colors.base)).toBeGreaterThanOrEqual(4.5);
  });
});
