// src/screens/DashboardScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fonts, radius, shadow } from '../theme/spacing';
import { useFocus } from '../context/FocusContext';
import { useTracker } from '../context/TrackerContext';
import Sidebar from '../components/Sidebar';

export default function DashboardScreen({ navigation }) {
  const { todayFocusSeconds, sessionsCompleted } = useFocus();
  const { trackers } = useTracker();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const hours = Math.floor(todayFocusSeconds / 3600);
  const minutes = Math.floor((todayFocusSeconds % 3600) / 60);
  const completedHabits = trackers.filter((t) => t.done).length;

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header row: avatar + title */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.avatarCircle} onPress={() => setSidebarVisible(true)}>
            <Ionicons name="person" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule your day</Text>
        </View>

        {/* Hamburger menu below header */}
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Pastel stat cards row */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.purple }]}
            onPress={() => navigation.navigate('Pomodoro')}
          >
            <Ionicons name="time-outline" size={22} color={colors.onPastelText} />
            <Text style={styles.statValue}>
              {hours}h {minutes}m
            </Text>
            <Text style={styles.statLabel}>Today's Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.mint }]}
            onPress={() => navigation.navigate('Tracker')}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color={colors.onPastelText} />
            <Text style={styles.statValue}>{sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions Done</Text>
          </TouchableOpacity>
        </View>

        {/* Featured section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <TouchableOpacity
          style={[styles.wideCard, { backgroundColor: colors.orange }]}
          onPress={() => navigation.navigate('Pomodoro')}
        >
          <View style={styles.wideCardText}>
            <Text style={styles.wideCardTitle}>Start a Focus Session</Text>
            <Text style={styles.wideCardSubtitle}>Pomodoro timer, distraction-free</Text>
          </View>
          <View style={styles.playButton}>
            <Ionicons name="play" size={16} color={colors.orange} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wideCard, { backgroundColor: colors.pink }]}
          onPress={() => navigation.navigate('Tracker')}
        >
          <View style={styles.wideCardText}>
            <Text style={styles.wideCardTitle}>Daily Habits</Text>
            <Text style={styles.wideCardSubtitle}>
              {completedHabits} of {trackers.length} completed today
            </Text>
          </View>
          <View style={styles.playButton}>
            <Ionicons name="arrow-forward" size={16} color={colors.pink} />
          </View>
        </TouchableOpacity>

        {/* Motivation card */}
        <View style={[styles.wideCard, styles.tipCard]}>
          <View style={styles.wideCardText}>
            <Text style={styles.tipTitle}>Quick Tip</Text>
            <Text style={styles.tipSubtitle}>
              25 minutes of deep focus beats 2 hours of distracted work.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.heading,
    color: colors.textPrimary,
  },
  menuButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.soft,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: fontSize.heading,
    color: colors.onPastelText,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.small,
    color: colors.onPastelTextMuted,
    marginTop: spacing.xs,
  },
  sectionHeaderRow: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.bodyLarge,
    color: colors.textPrimary,
  },
  wideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  wideCardText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  wideCardTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.bodyLarge,
    color: colors.onPastelText,
  },
  wideCardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.onPastelTextMuted,
    marginTop: spacing.xs,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  tipSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});