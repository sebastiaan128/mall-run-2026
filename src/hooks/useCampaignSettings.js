import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const SETTINGS_REF = doc(db, 'settings', 'campaign');

const DEFAULTS = {
  raisedAmount: 0,
  goalAmount: 10000,
  stretchGoal: 20000,
};

// Leest src/settings/campaign live uit Firestore. Bestaat het document nog niet
// (nieuw Firebase-project), dan vallen we terug op DEFAULTS zodat de site altijd werkt.
export function useCampaignSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      SETTINGS_REF,
      (snap) => {
        setSettings(snap.exists() ? { ...DEFAULTS, ...snap.data() } : DEFAULTS);
        setLoading(false);
      },
      (error) => {
        console.error('Kon campagne-instellingen niet laden:', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { settings, loading };
}

// Alleen bruikbaar voor ingelogde admins (zie firestore.rules): schrijft/overschrijft
// het instellingen-document. merge:true zodat je ook maar 1 veld kunt bijwerken.
export async function updateCampaignSettings(partial) {
  await setDoc(SETTINGS_REF, partial, { merge: true });
}
