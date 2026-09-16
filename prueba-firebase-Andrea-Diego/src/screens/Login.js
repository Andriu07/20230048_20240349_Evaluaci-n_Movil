import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  TouchableOpacity, Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';
import CustomInput from '../components/customInput';
import CustomButton from '../components/CustomButton';

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { iniciarSesion } = useAuth();

  const validar = () => {
    const e = {};
    if (!correo.trim()) e.correo = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) e.correo = 'Correo no valido';
    if (!password) e.password = 'La contrasena es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      await iniciarSesion(correo.trim(), password);
    } catch (error) {
      let msg = 'No se pudo iniciar sesion.';
      if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found']
        .includes(error.code)) msg = 'Correo o contrasena incorrectos.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesion para continuar</Text>

        <CustomInput label="Correo" value={correo} onChangeText={setCorreo}
          placeholder="correo@ejemplo.com" keyboardType="email-address"
          autoCapitalize="none" error={errors.correo} />
        <CustomInput label="Contrasena" value={password} onChangeText={setPassword}
          placeholder="Tu contrasena" secureTextEntry error={errors.password} />

        <CustomButton title="Iniciar sesion" onPress={handleLogin} loading={loading} />

        <TouchableOpacity style={styles.linkWrapper} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>No tienes cuenta? Registrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 30, fontWeight: '800', color: colors.secondary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 28, marginTop: 4 },
  linkWrapper: { marginTop: 18, alignItems: 'center' },
  link: { color: colors.primary, fontWeight: '600' },
});