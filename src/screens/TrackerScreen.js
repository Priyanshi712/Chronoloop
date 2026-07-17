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
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fonts, radius, shadow } from '../theme/spacing';
import { useTracker } from '../context/TrackerContext';
import AnimatedButton from '../components/AnimatedButton';

const CARD_COLORS = [colors.purple, colors.mint, colors.orange, colors.pink, colors.yellow, colors.blue];

export default function TrackerScreen() {
  const { trackers, addTracker, toggleTracker, deleteTracker } = useTracker();
  const [newHabit, setNewHabit] = useState('');
  const [inputVisible, setInputVisible] = useState(false);

  const handleAdd = () => {
    if (newHabit.trim().length === 0) return;
    addTracker(newHabit.trim());
    setNewHabit('');
    setInputVisible(false);
  };

  const completedCount = trackers.filter((t) => t.done).length;
  const progressPercent = trackers.length > 0 ? completedCount / trackers.length : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Habit Tracker</Text>
      <Text style={styles.subtitle}>
        {completedCount} of {trackers.length} completed today
      </Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
      </View>

      <FlatList
        data={trackers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const cardColor = CARD_COLORS[index % CARD_COLORS.length];
          return (
            <AnimatedButton
              style={[
                styles.trackerCard,
                { backgroundColor: item.done ? cardColor : colors.surfaceElevated },
              ]}
              onPress={() => toggleTracker(item.id)}
            >
              <View style={styles.trackerRow}>
                <View
                  style={[
                    styles.checkbox,
                    item.done && styles.checkboxDone,
                    item.done && { borderColor: colors.onPastelText },
                  ]}
                >
                  {item.done && (
                    <Ionicons name="checkmark" size={16} color={colors.onPastelText} />
                  )}
                </View>
                <Text
                  style={[
                    styles.trackerText,
                    { color: item.done ? colors.onPastelText : colors.textPrimary },
                    item.done && styles.trackerTextDone,
                  ]}
                >
                  {item.title}
                </Text>
                <TouchableOpacity onPress={() => deleteTracker(item.id)} hitSlop={10}>
                  <Ionicons
                    name="close"
                    size={18}
                    color={item.done ? colors.onPastelTextMuted : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </AnimatedButton>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits yet. Add one below.</Text>
        }
        ListFooterComponent={
          inputVisible ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add a new habit..."
                placeholderTextColor={colors.textMuted}
                value={newHabit}
                onChangeText={setNewHabit}
                onSubmitEditing={handleAdd}
                autoFocus
              />
              <TouchableOpacity style={styles.confirmButton} onPress={handleAdd}>
                <Ionicons name="checkmark" size={20} color={colors.onPastelText} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addNewButton}
              onPress={() => setInputVisible(true)}
            >
              <Ionicons name="add" size={20} color={colors.textSecondary} />
              <Text style={styles.addNewText}>Add new habit</Text>
            </TouchableOpacity>
          )
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
    fontFamily: fonts.bold,
    fontSize: fontSize.heading,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.mint,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  trackerCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.soft,
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxDone: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  trackerText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.body,
    flex: 1,
  },
  trackerTextDone: {
    textDecorationLine: 'line-through',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: spacing.xl,
    fontSize: fontSize.body,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  confirmButton: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  addNewText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
});