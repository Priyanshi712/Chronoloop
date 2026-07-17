// src/components/Sidebar.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fonts, radius } from '../theme/spacing';

const MENU_ITEMS = [
  { key: 'account', label: 'Account', icon: 'person-outline' },
  { key: 'theme', label: 'Theme', icon: 'color-palette-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
];

export default function Sidebar({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Drawer FIRST so it renders on the left */}
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={26} color={colors.textPrimary} />
            </View>
            <Text style={styles.name}>Priyanshi</Text>
            <Text style={styles.email}>priyanshi27705@gmail.com</Text>
          </View>

          <View style={styles.divider} />

          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.key} style={styles.menuItem}>
              <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Backdrop SECOND so it fills the remaining right side */}
        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: '75%',
    backgroundColor: colors.surface,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  drawerHeader: {
    marginBottom: spacing.lg,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.bodyLarge,
    color: colors.textPrimary,
  },
  email: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  menuLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
});