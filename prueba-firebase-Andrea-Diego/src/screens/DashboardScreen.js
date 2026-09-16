import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import UserCard from '../components/CardUsers';
import CustomInput from '../components/customInput';
import CustomButton from '../components/CustomButton';
import { colors } from '../theme/colors';

export default function DashboardScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
 
  // Campos editables
  const [nombre, setNombre] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
 
  const uid = auth.currentUser?.uid;
 
  // Cargar los datos del usuario autenticado desde Firestore.
  const cargarDatos = async () => {
    try {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setNombre(data.nombre || '');
        setImagenUrl(data.imagenUrl || '');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (uid) cargarDatos();
  }, [uid]);
 
  // Actualizar los datos en Firestore.
  const handleGuardar = async () => {
    if (!nombre.trim() || !imagenUrl.trim()) {
      Alert.alert('Atención', 'El nombre y la URL de imagen no pueden estar vacíos.');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'usuarios', uid), {
        nombre: nombre.trim(),
        imagenUrl: imagenUrl.trim(),
      });
      setUserData({ ...userData, nombre: nombre.trim(), imagenUrl: imagenUrl.trim() });
      setEditMode(false);
      Alert.alert('Listo', 'Datos actualizados correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los datos.');
    } finally {
      setSaving(false);
    }
  };
 
  const handleLogout = async () => {
    await signOut(auth); // El listener redirige al Login.
  };
 
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
 
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mi perfil</Text>
 
      <UserCard
        nombre={userData?.nombre}
        carnet={userData?.carnet}
        fechaNacimiento={userData?.fechaNacimiento}
        correo={userData?.correo}
        imagenUrl={userData?.imagenUrl}
      />
 
      {editMode ? (
        <View style={styles.editBox}>
          <Text style={styles.editTitle}>Editar información</Text>
          <CustomInput label="Nombre completo" value={nombre} onChangeText={setNombre} />
          <CustomInput label="URL de imagen" value={imagenUrl}
            onChangeText={setImagenUrl} autoCapitalize="none" />
          <CustomButton title="Guardar cambios" onPress={handleGuardar} loading={saving} />
          <CustomButton title="Cancelar" variant="secondary"
            onPress={() => setEditMode(false)} />
        </View>
      ) : (
        <View style={styles.actions}>
          <CustomButton title="Editar datos" onPress={() => setEditMode(true)} />
        </View>
      )}
 
      <View style={styles.logout}>
        <CustomButton title="Cerrar sesión" variant="danger" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  title: { fontSize: 26, fontWeight: '800', color: colors.secondary, marginBottom: 20 },
  actions: { marginTop: 20 },
  editBox: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editTitle: { fontSize: 17, fontWeight: '700', color: colors.secondary, marginBottom: 12 },
  logout: { marginTop: 28 },
});
 