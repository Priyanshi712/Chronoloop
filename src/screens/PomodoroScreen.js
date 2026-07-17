// src/screens/PomodoroScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, fontSize, fonts, radius, shadow } from '../theme/spacing';
import { useFocus } from '../context/FocusContext';
import ProgressRing from '../components/ProgressRing';

const PRESET_MINUTES = [15, 25, 45, 60];
const DEFAULT_MINUTES = 25;

export default function PomodoroScreen() {
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const intervalRef = useRef(null);

  const { addFocusSecond, completeSession } = useFocus();

  const totalSeconds = durationMinutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            completeSession();
            return 0;
          }
          addFocusSecond();
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const selectDuration = (minutes) => {
    setDurationMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setIsRunning(false);
    setModalVisible(false);
  };

  const applyCustomDuration = () => {
    const value = parseInt(customInput, 10);
    if (!value || value <= 0 || value > 180) return;
    selectDuration(value);
    setCustomInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>FOCUS SESSION</Text>

      <ProgressRing size={280} strokeWidth={3} progress={progress}>
        <View style={styles.ringInner}>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          <Text style={styles.timerSubtext}>
            {isRunning ? 'Stay focused' : 'Ready when you are'}
          </Text>
        </View>
      </ProgressRing>

      <TouchableOpacity
        style={styles.durationPill}
        disabled={isRunning}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.durationPillText}>{durationMinutes} min · Tap to change</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleStartPause}>
          <Text style={styles.primaryButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Duration</Text>

            <View style={styles.presetRow}>
              {PRESET_MINUTES.map((min) => (
                <TouchableOpacity
                  key={min}
                  style={[styles.presetChip, durationMinutes === min && styles.presetChipActive]}
                  onPress={() => selectDuration(min)}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      durationMinutes === min && styles.presetChipTextActive,
                    ]}
                  >
                    {min}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.customLabel}>Or enter custom minutes</Text>
            <View style={styles.customRow}>
              <TextInput
                style={styles.customInput}
                placeholder="e.g. 90"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                value={customInput}
                onChangeText={setCustomInput}
                onSubmitEditing={applyCustomDuration}
              />
              <TouchableOpacity style={styles.customApplyButton} onPress={applyCustomDuration}>
                <Text style={styles.customApplyText}>Set</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.small,
    letterSpacing: 3,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontFamily: fonts.light,
    fontSize: fontSize.display,
    color: colors.textPrimary,
  },
  timerSubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  durationPill: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  durationPillText: {
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    fontSize: fontSize.small,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    ...shadow.soft,
  },
  primaryButtonText: {
    fontFamily: fonts.semiBold,
    color: colors.background,
    fontSize: fontSize.body,
  },
  secondaryButton: {
    backgroundColor: colors.glass,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  secondaryButtonText: {
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.glassBorder,
  },
  modalTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.heading,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  presetChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    backgroundColor: colors.glass,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetChipText: {
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    fontSize: fontSize.body,
  },
  presetChipTextActive: {
    color: colors.background,
  },
  customLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  customRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  customInput: {
    flex: 1,
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  customApplyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customApplyText: {
    fontFamily: fonts.semiBold,
    color: colors.background,
    fontSize: fontSize.body,
  },
  modalCloseButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  modalCloseText: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: fontSize.body,
  },
});