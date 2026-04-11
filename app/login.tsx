import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, Dimensions, KeyboardAvoidingView, Platform,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth, parseAuthError } from '../context/AuthContext';
import { AuthError } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, savedEmail, rememberMe: savedRemember } = useAuth();

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError]   = useState('');

  useEffect(() => {
    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [savedRemember, savedEmail]);

  const headerY       = useRef(new Animated.Value(-24)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardY         = useRef(new Animated.Value(32)).current;
  const cardOpacity   = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerY,       { toValue: 0, duration: 550, useNativeDriver: true }),
        Animated.timing(headerOpacity, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardY,       { toValue: 0, duration: 480, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 480, useNativeDriver: true }),
      ]),
      Animated.timing(footerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailError('E-posta adresi gerekli');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Geçerli bir e-posta girin');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPassError('Şifre gerekli');
      valid = false;
    } else if (password.length < 6) {
      setPassError('En az 6 karakter olmalı');
      valid = false;
    } else {
      setPassError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) { shakeForm(); return; }
    setLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
    } catch (err) {
      const msg = parseAuthError(err as AuthError);
      shakeForm();
      if (msg.includes('şifre') || msg.includes('hatalı')) setPassError(msg);
      else setEmailError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030308" />

      {/* Background aurora orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

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
          <Animated.View
            style={[styles.header, {
              opacity: headerOpacity,
              transform: [{ translateY: headerY }],
            }]}
          >
            <View style={styles.logoWrap}>
              <View style={styles.logoOuter}>
                <View style={styles.logoInner}>
                  <Ionicons name="calendar" size={26} color="#9F67FF" />
                </View>
              </View>
              <View style={styles.logoPulse} />
            </View>
            <Text style={styles.appName}>Günlük Takvimim</Text>
            <Text style={styles.appTagline}>Hayatını organize et, anı yakala</Text>
          </Animated.View>

          {/* ─── FORM CARD ─── */}
          <Animated.View
            style={[styles.card, {
              opacity: cardOpacity,
              transform: [{ translateY: cardY }, { translateX: shakeAnim }],
            }]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Hoş Geldin</Text>
              <Text style={styles.cardSubtitle}>Hesabına devam et</Text>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>E-POSTA</Text>
              <View style={[
                styles.field,
                emailFocused && styles.fieldFocused,
                !!emailError && styles.fieldError,
              ]}>
                <Ionicons
                  name="mail-outline"
                  size={17}
                  color={emailFocused ? '#9F67FF' : '#353550'}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="ornek@mail.com"
                  placeholderTextColor="#353550"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
              {!!emailError && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              )}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ŞİFRE</Text>
              <View style={[
                styles.field,
                passFocused && styles.fieldFocused,
                !!passError && styles.fieldError,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color={passFocused ? '#9F67FF' : '#353550'}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="••••••••"
                  placeholderTextColor="#353550"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPassError(''); }}
                  secureTextEntry={!showPass}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPass ? 'eye-off-outline' : 'eye-outline'}
                    size={19}
                    color="#353550"
                  />
                </TouchableOpacity>
              </View>
              {!!passError && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                  <Text style={styles.errorText}>{passError}</Text>
                </View>
              )}
            </View>

            {/* Remember + Forgot */}
            <View style={styles.rememberRow}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={11} color="#fff" />}
                </View>
                <Text style={styles.rememberText}>Beni hatırla</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotText}>Şifremi unuttum</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              disabled={loading}
            >
              <View style={styles.loginBtnGlow} />
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.loginBtnContent}>
                  <Text style={styles.loginBtnText}>Giriş Yap</Text>
                  <View style={styles.loginBtnArrow}>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divLine} />
              <Text style={styles.divText}>ya da</Text>
              <View style={styles.divLine} />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <View style={styles.socialIconWrap}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.socialBtnText}>Google ile devam et</Text>
              <Ionicons name="chevron-forward" size={15} color="#353550" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
              <View style={styles.socialIconWrap}>
                <Ionicons name="logo-apple" size={17} color="#F0F0FF" />
              </View>
              <Text style={styles.socialBtnText}>Apple ile devam et</Text>
              <Ionicons name="chevron-forward" size={15} color="#353550" />
            </TouchableOpacity>
          </Animated.View>

          {/* ─── FOOTER ─── */}
          <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
            <Text style={styles.footerText}>Hesabın yok mu? </Text>
            <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Kayıt ol</Text>
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

  // Aurora background orbs
  orb1: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#7C3AED',
    opacity: 0.07,
    top: -120,
    left: -80,
  },
  orb2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#EC4899',
    opacity: 0.055,
    top: 100,
    right: -80,
  },
  orb3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#7C3AED',
    opacity: 0.05,
    bottom: height * 0.25,
    left: width * 0.3,
  },

  scroll: { paddingTop: 64, paddingHorizontal: 22, paddingBottom: 40 },

  // ─── Header ───
  header: { alignItems: 'center', marginBottom: 36 },
  logoWrap: { position: 'relative', marginBottom: 20 },
  logoOuter: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#0A0A14',
    borderWidth: 1,
    borderColor: '#7C3AED28',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED14',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7C3AED30',
  },
  logoPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#7C3AED20',
    top: 0,
    left: 0,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F0F0FF',
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 13,
    color: '#50506A',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

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
  cardHeader: { marginBottom: 28 },
  cardTitle:  { fontSize: 22, fontWeight: '800', color: '#F0F0FF', marginBottom: 5, letterSpacing: -0.3 },
  cardSubtitle: { fontSize: 13, color: '#50506A' },

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
    paddingVertical: 16,
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

  // ─── Remember + Forgot ───
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 4,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#ffffff15',
    backgroundColor: '#0F0F1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  rememberText: { color: '#7070A0', fontSize: 13, fontWeight: '500' },
  forgotText:   { color: '#9F67FF', fontSize: 13, fontWeight: '600' },

  // ─── Login Button ───
  loginBtn: {
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 15,
  },
  loginBtnDisabled: { opacity: 0.65 },
  loginBtnGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#9F67FF18',
  },
  loginBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loginBtnText:    { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  loginBtnArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff18',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Divider ───
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  divLine: { flex: 1, height: 1, backgroundColor: '#ffffff08' },
  divText: { color: '#353550', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },

  // ─── Social ───
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F1A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 10,
  },
  socialIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff08',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5F9FFF',
  },
  socialBtnText: { flex: 1, color: '#7070A0', fontSize: 14, fontWeight: '600' },

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
