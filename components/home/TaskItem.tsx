import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, PRIORITY_CONFIG } from '../../types/task';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface Props {
  task: Task;
  onToggle:    (id: string) => void;
  onDelete:    (id: string) => void;
  onLongPress: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onLongPress }: Props) {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const fadeAnim   = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(task.completed ? 1 : 0)).current;

  const priority = PRIORITY_CONFIG[task.priority];

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.975, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 90, friction: 5, useNativeDriver: true }),
    ]).start();

    Animated.spring(checkScale, {
      toValue: task.completed ? 0 : 1,
      tension: 120,
      friction: 6,
      useNativeDriver: true,
    }).start();

    onToggle(task.id);
  };

  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 180, useNativeDriver: true }),
    ]).start(() => onDelete(task.id));
  };

  return (
    <TouchableOpacity onLongPress={() => onLongPress(task)} delayLongPress={350} activeOpacity={1}>
      <Animated.View
        style={[
          styles.container,
          task.completed && styles.containerDone,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Priority left bar */}
        <View style={[styles.priorityBar, { backgroundColor: task.completed ? COLORS.textMuted : priority.color }]} />

        {/* Subtle priority tint (only active tasks) */}
        {!task.completed && (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFillObject, {
              backgroundColor: priority.color + '05',
              borderRadius: RADIUS.lg,
            }]}
          />
        )}

        {/* Body */}
        <View style={styles.body}>
          {/* Top row: checkbox + title */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={handleToggle}
              style={styles.checkOuter}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={[
                styles.checkRing,
                task.completed
                  ? { borderColor: COLORS.success, backgroundColor: COLORS.success }
                  : { borderColor: priority.color + '70', backgroundColor: priority.color + '10' },
              ]}>
                <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                  <Ionicons name="checkmark" size={13} color="#fff" />
                </Animated.View>
              </View>
            </TouchableOpacity>

            <Text
              style={[styles.title, task.completed && styles.titleDone]}
              numberOfLines={2}
            >
              {task.title}
            </Text>

            {/* Delete button */}
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Bottom row: priority badge + done badge */}
          <View style={styles.bottomRow}>
            <View style={[styles.priorityBadge, { backgroundColor: priority.color + '18', borderColor: priority.color + '30' }]}>
              <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
              <Text style={[styles.priorityLabel, { color: priority.color }]}>
                {priority.label}
              </Text>
            </View>

            {task.completed && (
              <View style={styles.doneBadge}>
                <Ionicons name="checkmark-circle" size={11} color={COLORS.success} />
                <Text style={styles.doneText}>Tamamlandı</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  containerDone: {
    backgroundColor: COLORS.surfaceAlt,
    opacity: 0.7,
  },

  priorityBar: {
    width: 3,
    alignSelf: 'stretch',
  },

  body: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: 9,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkOuter: { marginTop: 1 },
  checkRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  titleDone: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },

  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 38,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    gap: 5,
  },
  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  doneText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '700',
  },
});
