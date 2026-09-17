import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const PARTICIPANTS_REF = collection(db, 'participants');

// Live lijst van alle deelnemers, gesorteerd op aanmaakdatum (nieuwste onderaan).
export function useParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(PARTICIPANTS_REF, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setParticipants(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error('Kon deelnemers niet laden:', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { participants, loading };
}

// Eén deelnemer ophalen is niet als losse hook nodig: de lijst wordt overal live
// bijgehouden, dus de deelnemerspagina zoekt gewoon in de al-geladen participants.

// Onderstaande drie functies zijn alleen bruikbaar voor ingelogde admins
// (zie firestore.rules) en worden gebruikt vanuit het beheerscherm.
export async function addParticipant(data) {
  return addDoc(PARTICIPANTS_REF, {
    name: data.name ?? '',
    distance: data.distance ?? '7 km',
    team: data.team ?? 'Team Veenendaal',
    quote: data.quote ?? '',
    raisedAmount: Number(data.raisedAmount) || 0,
    goalAmount: Number(data.goalAmount) || 150,
    createdAt: serverTimestamp(),
  });
}

export async function updateParticipant(id, data) {
  await updateDoc(doc(db, 'participants', id), data);
}

export async function deleteParticipant(id) {
  await deleteDoc(doc(db, 'participants', id));
}
