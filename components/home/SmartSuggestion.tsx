import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../constants/theme';

interface Stats {
  total: number;
  completed: number;
  remaining: number;
  highPending: number;
}

interface Props {
  stats: Stats;
}

type SuggestionResult = {
  text: string;
  iconName: string;
  color: string;
};

function getSuggestion(stats: Stats): SuggestionResult {
  const { total, completed, remaining, highPending } = stats;

  if (total === 0)
    return { text: 'Yeni bir görev ekleyerek gününe başla.', iconName: 'add-circle-outline', color: COLORS.primary };
  if (completed === total)
    return { text: 'Tüm görevleri tamamladın. Muhteşem bir iş!', iconName: 'trophy-outline', color: COLORS.success };
  if (highPending >= 3)
    return { text: 'Çok sayıda yüksek öncelikli görev var. Önce bunlara odaklan.', iconName: 'warning-outline', color: COLORS.danger };
  if (highPending > 0)
    return { text: 'En önemli görevi önce tamamla, gerisi kolaylaşacak.', iconName: 'flag-outline', color: COLORS.warning };
  if (remaining <= 2 && total > 0)
    return { text: 'Az kaldı! Biraz daha gayret et.', iconName: 'rocket-outline', color: COLORS.accent };
  if (total >= 6 && remaining > 4)
    return { text: 'Bekleyen görevlerin fazla, öncelik sıralaması yap.', iconName: 'layers-outline', color: COLORS.primary };

  return { text: 'Verimli bir gün geçiriyorsun, devam et.', iconName: 'flash-outline', color: COLORS.primary };
}

export function SmartSuggestion({ stats }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const suggestion = getSuggestion(stats);

  useEffect(() => {
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      tension: 65,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [stats.total, stats.completed]);

  return (
    <Animated.View
      style={[
        styles.container,
        { borderColor: suggestion.color + '30' },
        {
          opacity: anim,
          transform: [{
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }),
          }],
        },
      ]}
    >
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: suggestion.color }]} />

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: suggestion.color + '14' }]}>
        <Ionicons name={suggestion.iconName as any} size={18} color={suggestion.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.label, { color: suggestion.color }]}>Akıllı Öneri</Text>
        <Text style={styles.text}>{suggestion.text}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: '500',
  },
});
