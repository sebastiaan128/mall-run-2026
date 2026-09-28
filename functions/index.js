import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { buildConfirmation } from './bevestiging.js';

initializeApp();

// Na elke inschrijving een bevestigingsmail klaarzetten in de collectie `mail`.
// De extensie Trigger Email verstuurt die via SMTP (Brevo). Dit gebeurt hier en
// niet in de browser: dan blijft `mail` dicht in firestore.rules en kan niemand
// via de site mail naar willekeurige adressen laten sturen.
// Region us-central1 omdat de database in nam5 staat.
export const bevestigInschrijving = onDocumentCreated(
  { document: 'registrations/{id}', region: 'us-central1' },
  async (event) => {
    const registration = event.data?.data();
    if (!registration?.email) return;

    await getFirestore()
      .collection('mail')
      .doc(event.params.id)
      .set({
        to: registration.email,
        message: buildConfirmation(registration),
      });
  }
);
