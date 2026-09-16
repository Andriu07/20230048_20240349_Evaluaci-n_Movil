import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  // Valores por defecto para desarrollo rápido
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('123456');
  const [isRegistering, setIsRegistering] = useState(false);

  const { login, register } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña.');
      return;
    }

    try {
      if (isRegistering) {
        await register(email, password);
        Alert.alert('¡Éxito!', 'Cuenta creada correctamente');
      } else {
        await login(email, password);
      }
    } catch (error) {
      Alert.alert('Error de Autenticación', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isRegistering ? 'Registrarse' : 'Ingresar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={() => setIsRegistering(!isRegistering)}
      >
        <Text style={styles.switchText}>
          {isRegistering 
            ? '¿Ya tienes cuenta? Inicia sesión aquí' 
            : '¿No tienes cuenta? Regístrate aquí'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  switchText: {
    color: '#0284c7',
    fontSize: 14,
  },
});