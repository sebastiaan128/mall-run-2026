// De bevestigingsmail na een inschrijving. Zelfde opbouw als de deelnemerspagina:
// startnummerkaart met afstand en naam, daarna wat er gebeurt en hoe je sponsort.
// Alleen inline stijlen en tabellen, want Gmail en Outlook negeren de rest.

const ROUNDS = { '7 km': 'één ronde', '14 km': 'twee rondes', '21,1 km': 'drie rondes' };

const IBAN = 'NL28 RABO 0111 4448 88';
const ACCOUNT = 'Youth for Christ Veenendaal';

function escape(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

export function buildConfirmation({ name, distance, team }) {
  const fullName = String(name || '').trim();
  const firstName = fullName.split(/\s+/)[0] || 'loper';
  const km = String(distance || '').replace(/\s*km\s*/i, '');
  const rounds = ROUNDS[distance];
  const reference = fullName ? `Mall Run ${fullName}` : 'Mall Run';
  const teamLabel = String(team || '').trim() || 'Individueel';

  const subject = 'Je staat aan de start van The Mall Run';

  const text = [
    `Je staat aan de start, ${firstName}.`,
    '',
    `Zaterdag 14 november 2026 loop je ${distance} door Veenendaal${rounds ? `, ${rounds}` : ''}.`,
    'Elke kilometer haal je geld op voor jongerencentrum The Mall.',
    '',
    'Wat er nu gebeurt',
    'We zetten je op de site met een eigen deelnemerspagina. Zodra die live staat, krijg je de link van ons.',
    'Een paar weken voor de loop mailen we de starttijd en waar je je startnummer ophaalt.',
    '',
    'Nu al sponsors zoeken?',
    'Laat ze overmaken met jouw naam in de omschrijving, dan tellen we het bij je stand op.',
    `Rekeningnummer: ${IBAN}`,
    `Ten name van: ${ACCOUNT}`,
    `Omschrijving: ${reference}`,
    '',
    'Vragen? Antwoord gewoon op deze mail.',
    'Tot 14 november,',
    'Youth for Christ Veenendaal',
  ].join('\n');

  const display = "font-family:'Archivo Black',Helvetica,Arial,sans-serif;";
  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bricolage+Grotesque:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#FAFAF9;">
<div style="display:none;max-height:0;overflow:hidden;">Je inschrijving voor The Mall Run op 14 november 2026 is binnen.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF9;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:'Bricolage Grotesque',Helvetica,Arial,sans-serif;color:#3A3937;">
  <tr><td style="padding:0 4px 24px;${display}font-size:17px;color:#17181A;">The Mall Run</td></tr>
  <tr><td style="background:#FFFFFF;border:1px solid #17181A;border-radius:16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:22px 28px 16px;border-bottom:1px solid #D6D5D1;${display}font-size:40px;line-height:1;color:#17181A;">${escape(km)}<span style="font-family:'Bricolage Grotesque',Helvetica,Arial,sans-serif;font-size:15px;color:#6E6B66;"> km</span></td>
        <td align="right" style="padding:22px 28px 16px;border-bottom:1px solid #D6D5D1;font-size:15px;color:#6E6B66;vertical-align:bottom;">${escape(teamLabel)}</td>
      </tr>
      <tr><td colspan="2" style="padding:28px;">
        <p style="margin:0;${display}font-size:30px;line-height:1.05;color:#17181A;">Je staat aan de start, ${escape(firstName)}.</p>
        <p style="margin:14px 0 0;font-size:16px;line-height:1.65;">Zaterdag 14 november 2026 loop je ${escape(distance)} door Veenendaal${rounds ? `, ${rounds}` : ''}. Elke kilometer haal je geld op voor jongerencentrum The Mall.</p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:36px 4px 0;">
    <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#17181A;">Wat er nu gebeurt</p>
    <p style="margin:0;font-size:16px;line-height:1.65;">We zetten je op de site met een eigen deelnemerspagina. Daar staat je stand en kunnen vrienden en familie je steunen. Zodra die pagina live staat, krijg je de link van ons.</p>
    <p style="margin:16px 0 0;font-size:16px;line-height:1.65;">Een paar weken voor de loop mailen we de starttijd en waar je je startnummer ophaalt.</p>
  </td></tr>
  <tr><td style="padding:32px 4px 0;">
    <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#17181A;">Nu al sponsors zoeken?</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Laat ze overmaken met jouw naam in de omschrijving, dan tellen we het bij je stand op.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDEDEA;border-radius:16px;font-size:15px;">
      <tr><td style="padding:16px 20px 6px;color:#6E6B66;">Rekeningnummer</td><td align="right" style="padding:16px 20px 6px;font-weight:700;color:#17181A;">${IBAN}</td></tr>
      <tr><td style="padding:6px 20px;color:#6E6B66;">Ten name van</td><td align="right" style="padding:6px 20px;font-weight:700;color:#17181A;">${ACCOUNT}</td></tr>
      <tr><td style="padding:6px 20px 16px;color:#6E6B66;">Omschrijving</td><td align="right" style="padding:6px 20px 16px;font-weight:700;color:#17181A;">${escape(reference)}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:36px 4px 0;">
    <a href="https://mall-run-b5ff6.web.app/#route" style="display:inline-block;background:#E85812;color:#17181A;text-decoration:none;font-weight:700;font-size:16px;padding:14px 26px;border-radius:999px;">Bekijk de route</a>
  </td></tr>
  <tr><td style="padding:40px 4px 0;font-size:15px;line-height:1.65;">
    Vragen? Antwoord gewoon op deze mail.<br>
    Tot 14 november,<br>
    Youth for Christ Veenendaal
  </td></tr>
  <tr><td style="padding:40px 4px 0;">
    <p style="margin:0;padding-top:20px;border-top:1px solid #D6D5D1;font-size:13px;line-height:1.7;color:#6E6B66;">
      Youth for Christ Veenendaal, De Reede 65, 3904 NT Veenendaal. KvK 41177015. ANBI-erkend: giften zijn onder voorwaarden aftrekbaar.<br>
      Je krijgt deze mail omdat je je hebt ingeschreven voor The Mall Run 2026.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, text, html };
}
