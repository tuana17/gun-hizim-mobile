import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayOffset } from '../../types/task';
import { COLORS, RADIUS } from '../../constants/theme';

interface Props {
  dayOffset: DayOffset;
}

const MESSAGES: Record<DayOffset, { iconName: string; title: string; subtitle: string }> = {
  '-1': {
    iconName: 'book-outline',
    title: 'Dün hiç görev eklenmemiş.',
    subtitle: 'Geçmişi değiştiremeyiz ama bugün harika şeyler yapabiliriz.',
  },
  '0': {
    iconName: 'sunny-outline',
    title: 'Bugün için henüz görev yok.',
    subtitle: 'Hızlı görev ekleyerek gününü planlamaya başla.',
  },
  '1': {
    iconName: 'telescope-outline',
    title: 'Yarın için henüz görev yok.',
    subtitle: 'Yarını planlamak, bugünden daha iyi başlamanı sağlar.',
  },
};

export function EmptyState({ dayOffset }: Props) {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  const msg = MESSAGES[dayOffset as keyof typeof MESSAGES] ?? MESSAGES['0'];

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);
    Animated.parallel([
      Animated.timing(opacity,     { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(translateY,  { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [dayOffset]);

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.iconCircle}>
        <Ionicons name={msg.iconName as any} size={32} color={COLORS.textMuted} />
      </View>
      <Text style={styles.title}>{msg.title}</Text>
      <Text style={styles.subtitle}>{msg.subtitle}</Text>

      <View style={styles.hint}>
        <Ionicons name="arrow-down-outline" size={13} color={COLORS.textMuted} />
        <Text style={styles.hintText}>Aşağıdan görev ekle</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 52,
    paddingHorizontal: 28,
    gap: 10,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surfaceGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
