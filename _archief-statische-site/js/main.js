// The Mall Run 2026 — kleine interactieve laag (geen backend/koppelingen)

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('registration-form');
  var thanks = document.getElementById('registration-thanks');

  if (form && thanks) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Let op: dit formulier is nog niet gekoppeld aan een backend/e-mail/CRM.
      // Hier zou de inschrijving verstuurd moeten worden (bijv. naar een API of formulierdienst).
      form.classList.add('hidden');
      thanks.classList.remove('hidden');
    });
  }
});
