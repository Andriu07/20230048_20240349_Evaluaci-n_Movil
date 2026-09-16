import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
 
export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [carnet, setCarnet] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
 
  // Validación de todos los campos obligatorios
  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!fechaNacimiento.trim()) e.fechaNacimiento = 'La fecha es obligatoria';
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fechaNacimiento))
      e.fechaNacimiento = 'Formato: DD/MM/AAAA';
    if (!carnet.trim()) e.carnet = 'El carnet es obligatorio';
    if (!imagenUrl.trim()) e.imagenUrl = 'La URL de imagen es obligatoria';
    else if (!/^https?:\/\/.+/.test(imagenUrl))
      e.imagenUrl = 'Debe ser una URL válida (http/https)';
    if (!correo.trim()) e.correo = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      e.correo = 'Correo no válido';
    if (!password) e.password = 'La contraseña es obligatoria';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
 
  const handleRegister = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      // 1. Crear usuario en Firebase Authhj
      const cred = await createUserWithEmailAndPassword(auth, correo.trim(), password);
 
      // 2. Guardar los datos en Firestore (colección "usuarios")
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nombre: nombre.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        carnet: carnet.trim(),
        imagenUrl: imagenUrl.trim(),
        correo: correo.trim(),
        creadoEn: new Date().toISOString(),
      });
      // La navegación al Dashboard ocurre automaticamente
      // por el listener de sesiopn (onAuthStateChanged).
    } catch (error) {
      let msg = 'Ocurrió un error al registrar.';
      if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está registrado.';
      if (error.code === 'auth/invalid-email') msg = 'Correo no válido.';
      if (error.code === 'auth/weak-password') msg = 'La contraseña es muy débil.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>
 
        <CustomInput label="Nombre completo" value={nombre} onChangeText={setNombre}
          placeholder="Ej. Juan Pérez" error={errors.nombre} />
        <CustomInput label="Fecha de nacimiento" value={fechaNacimiento}
          onChangeText={setFechaNacimiento} placeholder="DD/MM/AAAA"
          keyboardType="numbers-and-punctuation" error={errors.fechaNacimiento} />
        <CustomInput label="Carnet" value={carnet} onChangeText={setCarnet}
          placeholder="Ej. AB123456" autoCapitalize="characters" error={errors.carnet} />
        <CustomInput label="URL de imagen" value={imagenUrl} onChangeText={setImagenUrl}
          placeholder="https://..." autoCapitalize="none" error={errors.imagenUrl} />
        <CustomInput label="Correo" value={correo} onChangeText={setCorreo}
          placeholder="correo@ejemplo.com" keyboardType="email-address"
          autoCapitalize="none" error={errors.correo} />
        <CustomInput label="Contraseña" value={password} onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres" secureTextEntry error={errors.password} />
 
        <CustomButton title="Registrarme" onPress={handleRegister} loading={loading} />
 
        <TouchableOpacity style={styles.linkWrapper} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: colors.secondary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 24, marginTop: 4 },
  linkWrapper: { marginTop: 18, alignItems: 'center' },
  link: { color: colors.primary, fontWeight: '600' },
});
 