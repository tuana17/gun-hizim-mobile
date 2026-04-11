/**
 * SectionHeader — Sayfa içi bölüm başlığı + opsiyonel sağ aksiyon.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  title: string;
  badge?: string;
  badgeColor?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function SectionHeader({
  title, badge, badgeColor = '#7C3AED',
  actionLabel, onAction, style,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        <View style={[styles.titleBar, { backgroundColor: badgeColor }]} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor + '22', borderColor: badgeColor + '44' }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
          </View>
        )}
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction} style={styles.action}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F0F0FF',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  action: {
    paddingHorizontal: 4,
  },
  actionText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '600',
  },
});
