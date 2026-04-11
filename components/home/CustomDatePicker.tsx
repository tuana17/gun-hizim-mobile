import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { DayOffset } from '../../types/task';

interface Props {
  visible: boolean;
  currentOffset: DayOffset;
  onClose: () => void;
  onSelect: (offset: DayOffset) => void;
}

const TR_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
const TR_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'];

export function CustomDatePicker({ visible, currentOffset, onClose, onSelect }: Props) {
  const [displayDate, setDisplayDate] = useState(new Date());

  // Modal açıldığında gösterilecek ayı seçili günün ayına ayarla
  useEffect(() => {
    if (visible) {
      const d = new Date();
      d.setDate(d.getDate() + currentOffset);
      d.setDate(1); // Ay gösterimi için 1. güne sabitle
      setDisplayDate(d);
    }
  }, [visible, currentOffset]);

  // Bugünün gün başı (saat 00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Seçili günün (offset'e göre) gün başı
  const selectedDate = new Date(today);
  selectedDate.setDate(selectedDate.getDate() + currentOffset);

  const prevMonth = () => {
    const d = new Date(displayDate);
    d.setMonth(d.getMonth() - 1);
    setDisplayDate(d);
  };

  const nextMonth = () => {
    const d = new Date(displayDate);
    d.setMonth(d.getMonth() + 1);
    setDisplayDate(d);
  };

  const handleSelectDay = (day: number) => {
    const s = new Date(displayDate);
    s.setDate(day);
    s.setHours(0, 0, 0, 0);

    // time difference in ms -> days
    const diffTime = s.getTime() - today.getTime();
    const offset = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    onSelect(offset);
  };

  const renderCalendarDays = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    // Ayın ilk gününün haftanın hangi günü olduğu (0: Pazar, 1: Pzt, ...)
    // Biz Pzt'den başlatıyoruz, o yüzden shift ediyoruz
    const firstDay = new Date(year, month, 1).getDay();
    const shiftFirstDay = firstDay === 0 ? 6 : firstDay - 1; 

    // Ayın kaç çektiği
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    // Boşluklar
    for (let i = 0; i < shiftFirstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Günler
    for (let i = 1; i <= daysInMonth; i++) {
      const iterDate = new Date(year, month, i);
      iterDate.setHours(0, 0, 0, 0);
      
      const isSelected = iterDate.getTime() === selectedDate.getTime();
      const isToday = iterDate.getTime() === today.getTime();

      days.push(
        <TouchableOpacity 
          key={`day-${i}`} 
          style={[
            styles.dayCell, 
            isSelected && styles.dayCellSelected,
            isToday && !isSelected && styles.dayCellToday
          ]}
          onPress={() => handleSelectDay(i)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.dayTextSelected,
            isToday && !isSelected && styles.dayTextToday
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            
            <Text style={styles.monthTitle}>
              {TR_MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}
            </Text>
            
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Haftanın Günleri Başlıkları */}
          <View style={styles.weekDaysRow}>
            {TR_DAYS.map(d => (
              <Text key={d} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>

          {/* Takvim Grid */}
          <View style={styles.daysGrid}>
            {renderCalendarDays()}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  navBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100 / 7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: RADIUS.full,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayCellToday: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  dayTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  dayTextToday: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: SPACING.lg,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  }
});
