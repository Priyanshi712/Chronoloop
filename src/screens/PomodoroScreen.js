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
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { spacing, fontSize, fonts, radius, shadow } from '../theme/spacing';
import { useFocus } from '../context/FocusContext';
import ProgressRing from '../components/ProgressRing';
import AnimatedButton from '../components/AnimatedButton';

const PRESET_MINUTES = [15, 25, 45, 60];
const DEFAULT_MINUTES = 25;

export default function PomodoroScreen() {
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const intervalRef = useRef(null);

  const { addFocusSecond, completeSession, sessionHistory } = useFocus();

  const totalSeconds = durationMinutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  // Countdown ticking
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Context updates, safely after render
  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft === 0) {
      setIsRunning(false);
      completeSession(durationMinutes);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      addFocusSecond();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatClockTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStartPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning((prev) => !prev);
  };

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

      <View style={styles.ringWrapper}>
        <ProgressRing size={280} strokeWidth={10} progress={progress} color={colors.mint}>
          <View style={styles.ringInner}>
            <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          </View>
        </ProgressRing>
      </View>

      <TouchableOpacity
        style={styles.durationPill}
        disabled={isRunning}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.durationPillText}>{durationMinutes} min · Tap to change</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <AnimatedButton style={styles.secondaryButton} onPress={handleReset}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </AnimatedButton>

        <AnimatedButton style={styles.primaryButton} onPress={handleStartPause}>
          <Text style={styles.primaryButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </AnimatedButton>
      </View>

      {sessionHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Sessions</Text>
          {sessionHistory.slice(0, 3).map((session) => (
            <View key={session.id} style={styles.historyRow}>
              <View style={styles.historyDot} />
              <Text style={styles.historyText}>
                {session.durationMinutes} min session
              </Text>
              <Text style={styles.historyTime}>
                {formatClockTime(session.completedAt)}
              </Text>
            </View>
          ))}
        </View>
      )}

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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.small,
    letterSpacing: 3,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
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
  durationPill: {
    backgroundColor: colors.purple,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    marginBottom: spacing.xxl,
  },
  durationPillText: {
    fontFamily: fonts.semiBold,
    color: colors.onPastelText,
    fontSize: fontSize.small,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.orange,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    ...shadow.soft,
  },
  primaryButtonText: {
    fontFamily: fonts.bold,
    color: colors.onPastelText,
    fontSize: fontSize.body,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  historySection: {
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  historyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
    marginRight: spacing.sm,
  },
  historyText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textSecondary,
  },
  historyTime: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
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
    borderColor: colors.border,
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
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  presetChipActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  presetChipText: {
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    fontSize: fontSize.body,
  },
  presetChipTextActive: {
    color: colors.onPastelText,
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
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  customApplyButton: {
    backgroundColor: colors.purple,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customApplyText: {
    fontFamily: fonts.bold,
    color: colors.onPastelText,
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