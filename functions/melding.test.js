import { describe, expect, it } from 'vitest';
import { buildNotification } from './melding.js';

describe('buildNotification', () => {
  const registration = {
    name: 'Sanne de Vries',
    email: 'sanne@example.nl',
    phone: '06 12345678',
    distance: '14 km',
    team: '',
    motivation: '',
    donationAmount: 25,
  };

  it('noemt naam en afstand in het onderwerp', () => {
    expect(buildNotification(registration).subject).toBe('Nieuwe inschrijving: Sanne de Vries (14 km)');
  });

  it('zet alle gegevens in de tekst, met streepjes voor lege velden', () => {
    const { text } = buildNotification(registration);
    expect(text).toContain('E-mail: sanne@example.nl');
    expect(text).toContain('Telefoon: 06 12345678');
    expect(text).toContain('Team: -');
    expect(text).toContain('Eigen donatie: € 25');
  });

  it('escapet wat de inschrijver zelf intypt', () => {
    const { html } = buildNotification({ ...registration, motivation: '<img src=x>' });
    expect(html).not.toContain('<img src=x>');
    expect(html).toContain('&lt;img src=x&gt;');
  });
});
