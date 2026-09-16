import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

 
// Componente reutilizable de botón. Admite variantes y estado de carga.
export default function CustomButton({
  title,
  onPress,
  loading = false,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  disabled = false,
}) 
{
 
  return (
    <TouchableOpacity
      style={[styles.button, variantStyle, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  disabled: { opacity: 0.6 },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
 