import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
 
export function useUserData() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const uid = auth.currentUser?.uid;
 
  const cargar = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (snap.exists()) setUserData(snap.data());
    } finally {
      setLoading(false);
    }
  }, [uid]);
 
  useEffect(() => { cargar(); }, [cargar]);
 
  const actualizar = async (cambios) => {
    if (!uid) return;
    await updateDoc(doc(db, 'usuarios', uid), cambios);
    setUserData((prev) => ({ ...prev, ...cambios }));
  };
 
  return { userData, loading, cargar, actualizar };
}
 