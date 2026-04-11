import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayOffset, DAY_OPTIONS } from '../../types/task';
import { COLORS, RADIUS } from '../../constants/theme';

interface Props {
  selected: DayOffset;
  onChange: (offset: DayOffset) => void;
  onOpenPicker: () => void;
}

export function DaySelector({ selected, onChange, onOpenPicker }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {DAY_OPTIONS.map(({ offset, label }) => {
          const isActive = selected === offset;
          return (
            <TouchableOpacity
              key={offset}
              onPress={() => onChange(offset)}
              style={[styles.pill, isActive && styles.pillActive]}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.pillGlow} />}
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.calBtn} onPress={onOpenPicker} activeOpacity={0.7}>
        <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 4,
    gap: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  pillActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  pillGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#9F67FF18',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.2,
  },
  pillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff60',
  },
});
