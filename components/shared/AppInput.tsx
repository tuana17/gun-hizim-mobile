/**
 * AppInput — Uygulama genelinde kullanılan stil tutarlı text input bileşeni.
 */
import React, { useState } from 'react';
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, ViewStyle, TextInputProps,
} from 'react-native';

interface Props extends Omit<TextInputProps, 'style'> {
  label?: string;
  icon?: string;
  error?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function AppInput({
  label, icon, error, rightIcon, onRightIconPress,
  containerStyle, ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[
        styles.container,
        focused && styles.containerFocused,
        error  && styles.containerError,
      ]}>
        {icon && (
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor="#444"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn}>
            <Text style={styles.icon}>{rightIcon}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>⚠️ {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131f',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1e1e35',
    overflow: 'hidden',
  },
  containerFocused: {
    borderColor: '#7C3AED',
    backgroundColor: '#16162a',
  },
  containerError: { borderColor: '#EF4444' },
  iconWrap: { width: 50, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  input: {
    flex: 1,
    color: '#e8e8ff',
    fontSize: 15,
    paddingVertical: 15,
    paddingRight: 16,
  },
  rightIconBtn: { paddingHorizontal: 14, paddingVertical: 15 },
  error: { color: '#EF4444', fontSize: 12, marginLeft: 4 },
});
