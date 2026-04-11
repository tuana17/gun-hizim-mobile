/**
 * AppCard — Uygulama genelinde tutarlı kart (card) primitive.
 * Glassmorphism efektli, özelleştirilebilir dark kart bileşeni.
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: string;   // Sol kenarda renkli çubuk (opsiyonel)
  glow?: boolean;    // Mor glow gölgesi
}

export function AppCard({ children, style, accent, glow }: Props) {
  return (
    <View style={[
      styles.card,
      glow && styles.glowCard,
      style,
    ]}>
      {accent && <View style={[styles.accentBar, { backgroundColor: accent }]} />}
      <View style={[styles.content, accent && styles.contentWithAccent]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0e0e1e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e1e35',
    overflow: 'hidden',
  },
  glowCard: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  content: {
    padding: 18,
  },
  contentWithAccent: {
    paddingLeft: 22,
  },
});
