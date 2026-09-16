import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
 
export function useAuth() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
 
  // Control de sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);
 
  // Registro: crea el usuario y guarda sus datos en Firestore
  const registrar = async (correo, password, datos) => {
    const cred = await createUserWithEmailAndPassword(auth, correo, password);
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      ...datos,
      correo,
      creadoEn: new Date().toISOString(),
    });
    return cred.user;
  };
 
  const iniciarSesion = (correo, password) =>
    signInWithEmailAndPassword(auth, correo, password);
 
  const cerrarSesion = () => signOut(auth);
 
  return { user, checking, registrar, iniciarSesion, cerrarSesion };
}
 