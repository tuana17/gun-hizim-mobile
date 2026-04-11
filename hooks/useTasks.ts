import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Priority, DayOffset } from '../types/task';

export function getDateKey(offset: DayOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

const storageKey = (dateKey: string) => `tasks_v2_${dateKey}`;
const SEEDED_KEY = 'tasks_v2_seeded';

// Demo veriler — ilk açılışta bugün için yüklenir
function buildSampleTasks(dateKey: string): Task[] {
  const base = Date.now();
  return [
    {
      id: `sample_1_${base}`,
      title: 'Günlük planı hazırla ve öncelikleri belirle',
      priority: 'high',
      completed: false,
      dateKey,
      createdAt: base - 5000,
    },
    {
      id: `sample_2_${base}`,
      title: 'Toplantıya hazırlan — sunum notlarını gözden geçir',
      priority: 'high',
      completed: true,
      dateKey,
      createdAt: base - 4000,
    },
    {
      id: `sample_3_${base}`,
      title: 'E-postaları kontrol et ve cevapla',
      priority: 'medium',
      completed: false,
      dateKey,
      createdAt: base - 3000,
    },
    {
      id: `sample_4_${base}`,
      title: 'Projeyi gözden geçir, eksikleri not al',
      priority: 'medium',
      completed: false,
      dateKey,
      createdAt: base - 2000,
    },
    {
      id: `sample_5_${base}`,
      title: '30 dakika yürüyüş yap',
      priority: 'low',
      completed: true,
      dateKey,
      createdAt: base - 1000,
    },
  ];
}

export function useTasks() {
  const [dayOffset, setDayOffset] = useState<DayOffset>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const dateKey = getDateKey(dayOffset);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(storageKey(dateKey));
      if (raw) {
        setTasks(JSON.parse(raw));
      } else if (dayOffset === 0) {
        // Bugün ve hiç görev yoksa + ilk kez açılıyorsa sample ekle
        const seeded = await AsyncStorage.getItem(SEEDED_KEY);
        if (!seeded) {
          const samples = buildSampleTasks(dateKey);
          await AsyncStorage.setItem(storageKey(dateKey), JSON.stringify(samples));
          await AsyncStorage.setItem(SEEDED_KEY, 'true');
          setTasks(samples);
        } else {
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    } catch (_) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [dateKey]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const saveTasks = async (updated: Task[]) => {
    setTasks(updated);
    await AsyncStorage.setItem(storageKey(dateKey), JSON.stringify(updated));
  };

  const addTask = async (title: string, priority: Priority) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      priority,
      completed: false,
      dateKey,
      createdAt: Date.now(),
    };
    await saveTasks([newTask, ...tasks]);
  };

  const toggleTask = async (id: string) => {
    await saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = async (id: string) => {
    await saveTasks(tasks.filter(t => t.id !== id));
  };

  // Görev güncelle — kısmi güncelleme (description, notes, images, title, priority)
  const updateTask = async (id: string, updates: Partial<Task>) => {
    await saveTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const stats = {
    total:       tasks.length,
    completed:   tasks.filter(t => t.completed).length,
    remaining:   tasks.filter(t => !t.completed).length,
    highPending: tasks.filter(t => !t.completed && t.priority === 'high').length,
  };

  return {
    tasks, loading, dayOffset, setDayOffset,
    dateKey, stats, addTask, toggleTask, deleteTask, updateTask,
  };
}
