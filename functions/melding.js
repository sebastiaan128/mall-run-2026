// Melding aan de organisatie bij elke nieuwe inschrijving: alle gegevens op een
// rij, zodat niemand daarvoor in het beheerscherm hoeft te kijken.

export const ORGANISATION = 'info.veenendaal@yfc.nl';

function escape(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

export function buildNotification({ name, email, phone, distance, team, motivation, donationAmount }) {
  const fullName = String(name || '').trim() || 'Onbekend';
  const subject = `Nieuwe inschrijving: ${fullName} (${distance})`;

  const rows = [
    ['Naam', fullName],
    ['E-mail', email],
    ['Telefoon', phone],
    ['Afstand', distance],
    ['Team', team],
    ['Eigen donatie', donationAmount ? `€ ${donationAmount}` : ''],
    ['Motivatie', motivation],
  ].map(([label, value]) => [label, String(value ?? '').trim() || '-']);

  const text = [
    'Er is een nieuwe inschrijving voor The Mall Run.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Alle inschrijvingen: https://mall-run-b5ff6.web.app/admin',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:24px 16px;background:#FAFAF9;font-family:Helvetica,Arial,sans-serif;color:#3A3937;">
<p style="margin:0 0 16px;font-size:16px;">Er is een nieuwe inschrijving voor The Mall Run.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;font-size:15px;background:#FFFFFF;border:1px solid #D6D5D1;border-radius:12px;">
${rows
  .map(
    ([label, value]) =>
      `  <tr><td style="padding:10px 16px;color:#6E6B66;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:10px 16px;color:#17181A;white-space:pre-wrap;">${escape(value)}</td></tr>`
  )
  .join('\n')}
</table>
<p style="margin:16px 0 0;font-size:15px;"><a href="https://mall-run-b5ff6.web.app/admin" style="color:#17181A;">Alle inschrijvingen in het beheerscherm</a></p>
</body>
</html>`;

  return { subject, text, html };
}
