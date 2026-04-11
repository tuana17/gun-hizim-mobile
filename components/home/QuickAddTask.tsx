import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Priority, PRIORITY_CONFIG } from '../../types/task';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface Props {
  onAdd: (title: string, priority: Priority) => void;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

export function QuickAddTask({ onAdd }: Props) {
  const [title, setTitle]       = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [focused, setFocused]   = useState(false);
  const btnScale                = useRef(new Animated.Value(1)).current;

  const handleAdd = () => {
    if (!title.trim()) return;
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(btnScale,  { toValue: 1, tension: 90, friction: 6, useNativeDriver: true }),
    ]).start();
    onAdd(title.trim(), priority);
    setTitle('');
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      {/* Input row */}
      <View style={styles.inputRow}>
        <View style={styles.plusWrap}>
          <Ionicons name="add" size={18} color={focused ? COLORS.primary : COLORS.textMuted} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          placeholderTextColor={COLORS.textMuted}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          maxLength={120}
        />
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            onPress={handleAdd}
            style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-up" size={16} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Priority row */}
      <View style={styles.priorityRow}>
        <Text style={styles.priorityLabel}>Öncelik</Text>
        <View style={styles.pills}>
          {PRIORITIES.map(p => {
            const cfg    = PRIORITY_CONFIG[p];
            const active = priority === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[styles.pill, active && { backgroundColor: cfg.bg, borderColor: cfg.color + '60' }]}
                activeOpacity={0.7}
              >
                <View style={[styles.dot, { backgroundColor: cfg.color }]} />
                <Text style={[styles.pillText, active && { color: cfg.color }]}>
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  containerFocused: {
    borderColor: '#7C3AED40',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingLeft: 12,
    paddingRight: 6,
    gap: 8,
  },
  plusWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    paddingVertical: 14,
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },

  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priorityLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  pills: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
