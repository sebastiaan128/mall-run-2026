import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

const REGISTRATIONS_REF = collection(db, 'registrations');

// Publiek: iedereen mag een inschrijving aanmaken (zie firestore.rules — create-only,
// geen lezen/wijzigen/verwijderen). Dit is wat het inschrijfformulier aanroept.
export async function submitRegistration(data) {
  return addDoc(REGISTRATIONS_REF, {
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    distance: data.distance,
    team: data.team || '',
    motivation: data.motivation || '',
    donationAmount: data.donationAmount ? Number(data.donationAmount) : null,
    createdAt: serverTimestamp(),
  });
}

// Alleen bruikbaar voor ingelogde admins: live lijst van alle inschrijvingen,
// nieuwste bovenaan. Gebruikt in het beheerscherm.
export function useRegistrationsList() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(REGISTRATIONS_REF, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setRegistrations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error('Kon inschrijvingen niet laden (ben je ingelogd?):', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { registrations, loading };
}
