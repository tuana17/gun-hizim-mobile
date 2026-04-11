/**
 * LoadingScreen — Uygulama genelinde loading durumu ekranı.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'Yükleniyor...' }: Props) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.emoji, { opacity: pulse }]}>📅</Animated.Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080810',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emoji: { fontSize: 48 },
  message: {
    color: '#555',
    fontSize: 15,
    fontWeight: '500',
  },
});
