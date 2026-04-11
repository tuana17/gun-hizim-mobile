export type Priority = 'high' | 'medium' | 'low';

// Görev aktivite notu (kim ne yaptı, ne zaman)
export interface TaskNote {
  id: string;
  text: string;
  createdAt: number;
}

// Ana görev modeli
export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  dateKey: string;
  createdAt: number;
  description?: string;   // Açıklama / not
  notes?: TaskNote[];     // Aktivite geçmişi
  images?: string[];      // Fotoğraf URI'leri
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: 'Yüksek', color: '#EF4444', bg: '#EF444418' },
  medium: { label: 'Orta',   color: '#F59E0B', bg: '#F59E0B18' },
  low:    { label: 'Düşük',  color: '#10B981', bg: '#10B98118' },
};

export type DayOffset = number;
export const DAY_OPTIONS: { offset: DayOffset; label: string }[] = [
  { offset: -1, label: 'Dün'   },
  { offset: 0,  label: 'Bugün' },
  { offset: 1,  label: 'Yarın' },
];
