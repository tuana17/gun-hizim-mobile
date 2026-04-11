import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayOffset } from '../../types/task';
import { COLORS, SPACING } from '../../constants/theme';

interface Props {
  dayOffset: DayOffset;
  userName?: string;
  onSettingsPress?: () => void;
}

const TR_DAYS   = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const TR_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                   'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function getGreeting(): { text: string; icon: string } {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return { text: 'Günaydın',     icon: 'sunny-outline' };
  if (h >= 12 && h < 17) return { text: 'İyi günler',   icon: 'partly-sunny-outline' };
  if (h >= 17 && h < 21) return { text: 'İyi akşamlar', icon: 'moon-outline' };
  return                         { text: 'İyi geceler',  icon: 'moon-outline' };
}

export function DateHeader({ dayOffset, userName, onSettingsPress }: Props) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);

  const dayName  = TR_DAYS[d.getDay()];
  const day      = d.getDate();
  const month    = TR_MONTHS[d.getMonth()];
  const year     = d.getFullYear();
  const greeting = getGreeting();

  const relativeLabel =
    dayOffset === 0  ? 'Bugün'
    : dayOffset === -1 ? 'Dün'
    : dayOffset === 1  ? 'Yarın'
    : dayOffset < -1   ? `${Math.abs(dayOffset)} Gün Önce`
    :                    `${dayOffset} Gün Sonra`;

  const isToday = dayOffset === 0;

  return (
    <View style={styles.container}>
      {/* Top bar: greeting + settings */}
      <View style={styles.topBar}>
        <View style={styles.greetingRow}>
          <Ionicons name={greeting.icon as any} size={14} color={COLORS.textMuted} />
          <Text style={styles.greetingText}>
            {greeting.text}{userName ? `, ${userName}` : ''}
          </Text>
        </View>
        {onSettingsPress && (
          <TouchableOpacity style={styles.settingsBtn} onPress={onSettingsPress} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={19} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Large editorial day name */}
      <Text style={styles.dayName}>{dayName}</Text>

      {/* Date row + badge */}
      <View style={styles.dateRow}>
        <Text style={styles.fullDate}>{day} {month} {year}</Text>
        <View style={[styles.badge, isToday && styles.badgeToday]}>
          <View style={[styles.badgeDot, isToday && styles.badgeDotToday]} />
          <Text style={[styles.badgeText, isToday && styles.badgeTextToday]}>
            {relativeLabel}
          </Text>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator}>
        <View style={[styles.sepLine, styles.sepPrimary]} />
        <View style={[styles.sepLine, styles.sepAccent]} />
        <View style={[styles.sepLine, styles.sepFade]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.md,
    gap: 6,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayName: {
    fontSize: 46,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 50,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
    marginBottom: 14,
  },
  fullDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeToday: {
    backgroundColor: '#7C3AED18',
    borderWidth: 1,
    borderColor: '#7C3AED30',
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  badgeDotToday: {
    backgroundColor: '#9F67FF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgeTextToday: {
    color: '#9F67FF',
  },

  separator: {
    flexDirection: 'row',
    gap: 3,
    height: 2,
  },
  sepLine:    { height: 2, borderRadius: 1 },
  sepPrimary: { width: 32, backgroundColor: '#7C3AED' },
  sepAccent:  { width: 16, backgroundColor: '#EC4899' },
  sepFade:    { flex: 1,   backgroundColor: COLORS.border },
});
