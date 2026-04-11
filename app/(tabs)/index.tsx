import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, StatusBar,
  SafeAreaView, RefreshControl, KeyboardAvoidingView, Platform,
} from 'react-native';

import { useTasks }   from '../../hooks/useTasks';
import { useAuth }    from '../../context/AuthContext';
import {
  DateHeader, DaySelector, SmartSuggestion,
  DailySummary, TaskItem, EmptyState, CustomDatePicker,
} from '../../components/home';
import { QuickAddTask }    from '../../components/home/QuickAddTask';
import { TaskDetailModal } from '../../components/home/TaskDetailModal';
import { SectionHeader }   from '../../components/shared';
import { COLORS, SPACING } from '../../constants/theme';
import { DayOffset, Task } from '../../types/task';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function HomeScreen() {
  const { userProfile } = useAuth();
  const {
    tasks, loading, dayOffset, setDayOffset,
    stats, addTask, toggleTask, deleteTask, updateTask,
  } = useTasks();

  const [selectedTask,  setSelectedTask]  = useState<Task | null>(null);
  const [modalVisible,  setModalVisible]  = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeDetail = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedTask(null), 280);
  };

  const handleUpdate = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    if (selectedTask?.id === id) {
      setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });

  const firstName = userProfile?.displayName?.split(' ')[0];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={loading}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          {/* Date & Greeting Header */}
          <DateHeader
            dayOffset={dayOffset}
            userName={firstName}
          />

          {/* Day Selector */}
          <DaySelector
            selected={dayOffset}
            onChange={(o) => setDayOffset(o as DayOffset)}
            onOpenPicker={() => setPickerVisible(true)}
          />

          <View style={styles.gap} />

          {/* Smart Suggestion */}
          <SmartSuggestion stats={stats} />

          <View style={styles.gap} />

          {/* Daily Summary */}
          {stats.total > 0 && (
            <>
              <DailySummary stats={stats} />
              <View style={styles.gap} />
            </>
          )}

          {/* Tasks section */}
          <SectionHeader
            title="Görevler"
            badge={stats.remaining > 0 ? `${stats.remaining} bekliyor` : undefined}
            badgeColor={COLORS.accent}
          />

          <View style={{ height: SPACING.sm }} />

          {sortedTasks.length === 0 ? (
            <EmptyState dayOffset={dayOffset} />
          ) : (
            <View style={styles.taskList}>
              {sortedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onLongPress={openDetail}
                />
              ))}
            </View>
          )}

          <View style={styles.bottomPad} />
        </ScrollView>

        {/* Quick Add Bar */}
        <View style={styles.addBar}>
          <QuickAddTask onAdd={addTask} />
        </View>
      </KeyboardAvoidingView>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        visible={modalVisible}
        onClose={closeDetail}
        onUpdate={handleUpdate}
      />

      {/* Date Picker Modal */}
      <CustomDatePicker
        visible={pickerVisible}
        currentOffset={dayOffset}
        onClose={() => setPickerVisible(false)}
        onSelect={(offset) => {
          setDayOffset(offset);
          setPickerVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: COLORS.bg },
  flex:  { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  gap:      { height: SPACING.lg },
  taskList: { gap: 8 },
  bottomPad: { height: 20 },
  addBar: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? SPACING.sm : SPACING.md,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
