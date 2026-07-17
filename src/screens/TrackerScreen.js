// src/screens/TrackerScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize } from '../theme/spacing';
import { useTracker } from '../context/TrackerContext';

export default function TrackerScreen() {
  const { trackers, addTracker, toggleTracker, deleteTracker } = useTracker();
  const [newHabit, setNewHabit] = useState('');

  const handleAdd = () => {
    if (newHabit.trim().length === 0) return;
    addTracker(newHabit.trim());
    setNewHabit('');
  };

  const completedCount = trackers.filter((t) => t.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Trackers</Text>
      <Text style={styles.subtitle}>
        {completedCount} of {trackers.length} completed today
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new habit..."
          placeholderTextColor={colors.textMuted}
          value={newHabit}
          onChangeText={setNewHabit}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trackers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.trackerCard, item.done && styles.trackerCardDone]}
            onPress={() => toggleTracker(item.id)}
            onLongPress={() => deleteTracker(item.id)}
          >
            <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
              {item.done && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.trackerText,
                item.done && styles.trackerTextDone,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits yet. Add one above.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.heading,
    fontWeight: '400',
    marginTop: -2,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  trackerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  trackerCardDone: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  trackerText: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
    flex: 1,
  },
  trackerTextDone: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
    fontSize: fontSize.body,
  },
});