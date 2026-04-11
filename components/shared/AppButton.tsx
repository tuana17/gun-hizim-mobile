/**
 * AppButton — Uygulamanın her yerinde kullanılan temel buton bileşeni.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 */
import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, Animated, ViewStyle,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  icon?: string; // emoji or symbol
}

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; border: string }> = {
  primary:   { bg: '#7C3AED', text: '#ffffff', border: 'transparent' },
  secondary: { bg: '#0e0e1e', text: '#9B72FF', border: '#7C3AED55' },
  ghost:     { bg: 'transparent', text: '#9B72FF', border: 'transparent' },
  danger:    { bg: '#EF444418', text: '#EF4444', border: '#EF444433' },
};

export function AppButton({
  label, onPress, variant = 'primary',
  loading, disabled, fullWidth, style, icon,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const cfg = VARIANT_STYLES[variant];

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
    ]).start(onPress);
  };

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[
          styles.base,
          { backgroundColor: cfg.bg, borderColor: cfg.border },
          fullWidth && styles.fullWidth,
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={cfg.text} size="small" />
        ) : (
          <>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={[styles.label, { color: cfg.text }]}>{label}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    gap: 8,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  label: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  icon: { fontSize: 16 },
});
