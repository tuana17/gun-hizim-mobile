// Uygulama geneli design tokens — Premium Dark Edition
export const COLORS = {
  // Arka planlar
  bg:           '#030308',
  surface:      '#0A0A14',
  surfaceAlt:   '#0F0F1A',
  surfaceGlass: '#ffffff06',
  border:       '#ffffff0D',
  borderLight:  '#ffffff18',
  borderGlow:   '#7C3AED30',

  // Vurgu renkleri
  primary:      '#7C3AED',
  primaryLight: '#9F67FF',
  primaryGlow:  '#7C3AED22',
  accent:       '#EC4899',
  accentGlow:   '#EC489922',

  // Metin
  textPrimary:   '#F0F0FF',
  textSecondary: '#7070A0',
  textMuted:     '#353550',

  // Durum renkleri
  success:    '#10B981',
  successBg:  '#10B98112',
  warning:    '#F59E0B',
  warningBg:  '#F59E0B12',
  danger:     '#EF4444',
  dangerBg:   '#EF444412',

  // Öncelik
  high:       '#EF4444',
  highBg:     '#EF444412',
  medium:     '#F59E0B',
  mediumBg:   '#F59E0B12',
  low:        '#10B981',
  lowBg:      '#10B98112',
} as const;

export const RADIUS = {
  sm:   8,
  md:   14,
  lg:   20,
  xl:   26,
  xxl:  32,
  full: 9999,
} as const;

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  14,
  lg:  20,
  xl:  24,
  xxl: 32,
} as const;

export const SHADOW = {
  primary: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  accent: {
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
