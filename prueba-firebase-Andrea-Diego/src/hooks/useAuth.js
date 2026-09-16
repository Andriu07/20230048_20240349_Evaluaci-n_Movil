import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escucha el estado del usuario en tiempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Función para registrar un nuevo usuario
  const register = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // Función para cerrar sesión
  const logout = async () => {
    return await signOut(auth);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};