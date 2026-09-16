import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function UserCard({ nombre, carnet, fechaNacimiento, correo, imagenUrl }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        {imagenUrl ? (
          <Image source={{ uri: imagenUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarLetter}>
              {nombre ? nombre.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.nombre}>{nombre || 'Sin nombre'}</Text>

      <Row label="Carnet" value={carnet} />
      <Row label="Fecha de nacimiento" value={fechaNacimiento} />
      <Row label="Correo" value={correo} />
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatarWrapper: { marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: colors.white, fontSize: 36, fontWeight: '700' },
  nombre: { fontSize: 20, fontWeight: '700', color: colors.secondary, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowLabel: { color: colors.textSecondary, fontSize: 14 },
  rowValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
});