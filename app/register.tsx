import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform, StatusBar,
  ScrollView, ActivityIndicator, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth, parseAuthError } from '../context/AuthContext';
import { AuthError } from 'firebase/auth';

const { height } = Dimensions.get('window');

export default function RegisterScreen() {
  const { register } = useAuth();

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError,    setNameError]    = useState('');
  const [emailError,   setEmailError]   = useState('');
  const [passError,    setPassError]    = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [nameFocused,    setNameFocused]    = useState(false);
  const [emailFocused,   setEmailFocused]   = useState(false);
  const [passFocused,    setPassFocused]    = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(-20)).current;
  const cardOpacity   = useRef(new Animated.Value(0)).current;
  const cardY         = useRef(new Animated.Value(30)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerY,       { toValue: 0, duration: 520, useNativeDriver: true }),
        Animated.timing(headerOpacity, { toValue: 1, duration: 520, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardY,       { toValue: 0, duration: 460, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 460, useNativeDriver: true }),
      ]),
      Animated.timing(footerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    let ok = true;
    if (!name.trim()) { setNameError('Ad soyad gerekli'); ok = false; } else setNameError('');
    if (!email.trim()) { setEmailError('E-posta gerekli'); ok = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Geçerli bir e-posta girin'); ok = false; }
    else setEmailError('');
    if (!password) { setPassError('Şifre gerekli'); ok = false; }
    else if (password.length < 6) { setPassError('En az 6 karakter olmalı'); ok = false; }
    else setPassError('');
    if (!confirm) { setConfirmError('Şifreyi tekrar girin'); ok = false; }
    else if (confirm !== password) { setConfirmError('Şifreler eşleşmiyor'); ok = false; }
    else setConfirmError('');
    return ok;
  };

  const handleRegister = async () => {
    if (!validate()) { shake(); return; }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      const msg = parseAuthError(err as AuthError);
      shake();
      if (msg.includes('e-posta') || msg.includes('kullanılıyor')) setEmailError(msg);
      else setPassError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    iconName: string,
    value: string,
    onChange: (t: string) => void,
    error: string,
    focused: boolean,
    onFocus: () => void,
    onBlur: () => void,
    opts?: {
      placeholder?: string;
      keyboardType?: any;
      autoCapitalize?: any;
      secureTextEntry?: boolean;
      onToggleSecure?: () => void;
      showSecure?: boolean;
    }
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused, !!error && styles.fieldError]}>
        <Ionicons
          name={iconName as any}
          size={17}
          color={focused ? '#9F67FF' : '#353550'}
          style={styles.fieldIcon}
        />
        <TextInput
          style={styles.fieldInput}
          placeholder={opts?.placeholder ?? ''}
          placeholderTextColor="#353550"
          value={value}
          onChangeText={onChange}
          keyboardType={opts?.keyboardType ?? 'default'}
          autoCapitalize={opts?.autoCapitalize ?? 'none'}
          autoCorrect={false}
          secureTextEntry={opts?.secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {opts?.onToggleSecure && (
          <TouchableOpacity
            onPress={opts.onToggleSecure}
            style={styles.eyeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={opts.showSecure ? 'eye-off-outline' : 'eye-outline'}
              size={19}
              color="#353550"
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030308" />

      {/* Background orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── HEADER ─── */}
          <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={18} color="#9F67FF" />
              <Text style={styles.backText}>Geri</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ─── BRANDING ─── */}
          <Animated.View style={[styles.branding, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Ionicons name="person-add-outline" size={24} color="#EC4899" />
              </View>
            </View>
            <Text style={styles.brandTitle}>Hesap Oluştur</Text>
            <Text style={styles.brandSubtitle}>Günlük takvimini kişiselleştir</Text>
          </Animated.View>

          {/* ─── FORM CARD ─── */}
          <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardY }, { translateX: shakeAnim }] }]}>

            {renderField(
              'AD SOYAD', 'person-outline',
              name, (t) => { setName(t); setNameError(''); },
              nameError, nameFocused,
              () => setNameFocused(true), () => setNameFocused(false),
              { placeholder: 'Adın ve soyadın', autoCapitalize: 'words' }
            )}

            {renderField(
              'E-POSTA', 'mail-outline',
              email, (t) => { setEmail(t); setEmailError(''); },
              emailError, emailFocused,
              () => setEmailFocused(true), () => setEmailFocused(false),
              { placeholder: 'ornek@mail.com', keyboardType: 'email-address' }
            )}

            {renderField(
              'ŞİFRE', 'lock-closed-outline',
              password, (t) => { setPassword(t); setPassError(''); },
              passError, passFocused,
              () => setPassFocused(true), () => setPassFocused(false),
              {
                placeholder: '••••••••',
                secureTextEntry: !showPass,
                onToggleSecure: () => setShowPass(v => !v),
                showSecure: showPass,
              }
            )}

            {renderField(
              'ŞİFRE TEKRAR', 'shield-checkmark-outline',
              confirm, (t) => { setConfirm(t); setConfirmError(''); },
              confirmError, confirmFocused,
              () => setConfirmFocused(true), () => setConfirmFocused(false),
              {
                placeholder: 'Şifreni tekrar gir',
                secureTextEntry: !showConfirm,
                onToggleSecure: () => setShowConfirm(v => !v),
                showSecure: showConfirm,
              }
            )}

            {/* Privacy note */}
            <View style={styles.privacyBox}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#7C3AED" style={{ marginTop: 1 }} />
              <Text style={styles.privacyText}>
                Bilgilerin güvende. Kayıt olarak{' '}
                <Text style={styles.privacyLink}>Gizlilik Politikası</Text>'nı kabul etmiş olursun.
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              activeOpacity={0.85}
              style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
              disabled={loading}
            >
              <View style={styles.registerBtnGlow} />
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.registerBtnContent}>
                  <Text style={styles.registerBtnText}>Hesap Oluştur</Text>
                  <View style={styles.registerBtnArrow}>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* ─── FOOTER ─── */}
          <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
            <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030308' },
  flex:      { flex: 1 },

  orb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#EC4899',
    opacity: 0.06,
    top: -80,
    right: -80,
  },
  orb2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#7C3AED',
    opacity: 0.05,
    bottom: height * 0.2,
    left: -60,
  },

  scroll: { paddingTop: 54, paddingHorizontal: 22, paddingBottom: 40 },

  // ─── Header ───
  header: { marginBottom: 20 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#7C3AED14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7C3AED28',
  },
  backText: { color: '#9F67FF', fontSize: 14, fontWeight: '600' },

  // ─── Branding ───
  branding: { alignItems: 'center', marginBottom: 28 },
  logoOuter: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#0A0A14',
    borderWidth: 1,
    borderColor: '#EC489928',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 12,
  },
  logoInner: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EC489914',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EC489930',
  },
  brandTitle:    { fontSize: 24, fontWeight: '800', color: '#F0F0FF', marginBottom: 6, letterSpacing: -0.3 },
  brandSubtitle: { fontSize: 13, color: '#50506A' },

  // ─── Card ───
  card: {
    backgroundColor: '#0A0A14',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 20,
    gap: 0,
  },

  // ─── Fields ───
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#353550',
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F1A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ffffff0D',
    overflow: 'hidden',
  },
  fieldFocused: {
    borderColor: '#7C3AED55',
    backgroundColor: '#100E1A',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  fieldError: { borderColor: '#EF444455' },
  fieldIcon:  { marginLeft: 16 },
  fieldInput: {
    flex: 1,
    color: '#F0F0FF',
    fontSize: 15,
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  eyeBtn: { paddingHorizontal: 14, paddingVertical: 14 },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    marginLeft: 2,
  },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '500' },

  // ─── Privacy ───
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#7C3AED0E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 22,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#7C3AED20',
  },
  privacyText: { flex: 1, color: '#50506A', fontSize: 12, lineHeight: 18 },
  privacyLink: { color: '#9F67FF', fontWeight: '600' },

  // ─── Register Button ───
  registerBtn: {
    borderRadius: 16,
    backgroundColor: '#EC4899',
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 14,
  },
  registerBtnDisabled: { opacity: 0.65 },
  registerBtnGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF6EB410',
  },
  registerBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  registerBtnText:    { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  registerBtnArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff18',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Footer ───
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: { color: '#353550', fontSize: 14 },
  footerLink: { color: '#9F67FF', fontSize: 14, fontWeight: '700' },
});
