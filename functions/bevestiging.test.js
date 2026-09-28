import { describe, expect, it } from 'vitest';
import { buildConfirmation } from './bevestiging.js';

describe('buildConfirmation', () => {
  const registration = { name: 'Sanne de Vries', distance: '14 km', team: '' };

  it('spreekt de loper aan met de voornaam en noemt de rondes', () => {
    const { html, text } = buildConfirmation(registration);
    expect(html).toContain('Je staat aan de start, Sanne.');
    expect(text).toContain('loop je 14 km door Veenendaal, twee rondes.');
  });

  it('zet de volledige naam in de omschrijving voor de overboeking', () => {
    expect(buildConfirmation(registration).text).toContain('Omschrijving: Mall Run Sanne de Vries');
  });

  it('valt terug op Individueel zonder team', () => {
    expect(buildConfirmation(registration).html).toContain('>Individueel</td>');
  });

  it('escapet wat de inschrijver zelf intypt', () => {
    const { html } = buildConfirmation({ ...registration, team: '<script>x</script>' });
    expect(html).not.toContain('<script>x');
    expect(html).toContain('&lt;script&gt;x&lt;/script&gt;');
  });
});
