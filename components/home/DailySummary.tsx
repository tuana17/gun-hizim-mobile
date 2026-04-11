import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface Stats {
  total: number;
  completed: number;
  remaining: number;
}

interface Props { stats: Stats }

interface StatCardProps {
  value: number;
  label: string;
  color: string;
  bgColor: string;
  iconName: string;
}

function StatCard({ value, label, color, bgColor, iconName }: StatCardProps) {
  const scaleAnim   = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [value]);

  return (
    <Animated.View
      style={[
        styles.statCard,
        { backgroundColor: bgColor, borderColor: color + '28' },
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      ]}
    >
      <View style={[styles.statIconWrap, { backgroundColor: color + '18' }]}>
        <Ionicons name={iconName as any} size={16} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export function DailySummary({ stats }: Props) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { total, completed, remaining } = stats;
  const progress = total > 0 ? completed / total : 0;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      tension: 45,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const barColor =
    progress === 1  ? COLORS.success :
    progress > 0.65 ? COLORS.primary :
    progress > 0.3  ? COLORS.warning :
                      COLORS.accent;

  return (
    <View style={styles.container}>
      {/* Stat cards */}
      <View style={styles.statsRow}>
        <StatCard
          value={total}
          label="Toplam"
          color={COLORS.textSecondary}
          bgColor={COLORS.surfaceAlt}
          iconName="list-outline"
        />
        <StatCard
          value={completed}
          label="Tamamlandı"
          color={COLORS.success}
          bgColor={COLORS.successBg}
          iconName="checkmark-circle-outline"
        />
        <StatCard
          value={remaining}
          label="Bekliyor"
          color={COLORS.accent}
          bgColor={COLORS.accentGlow}
          iconName="time-outline"
        />
      </View>

      {/* Progress section */}
      {total > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Günlük İlerleme</Text>
            <Text style={[styles.progressPct, { color: barColor }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: barColor,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  shadowColor: barColor,
                },
              ]}
            />
          </View>
          {progress === 1 && (
            <View style={styles.completeRow}>
              <Ionicons name="trophy-outline" size={14} color={COLORS.success} />
              <Text style={styles.completeMsg}>Tüm görevler tamamlandı!</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 6,
    borderWidth: 1,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  progressSection: { gap: SPACING.sm },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 4,
  },
  completeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  completeMsg: {
    textAlign: 'center',
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
});
