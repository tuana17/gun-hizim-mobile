import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../lib/firebase';

const REMEMBER_KEY = 'gunluk_remember_me';
const SAVED_EMAIL_KEY = 'gunluk_saved_email';

// ── Tipler ──────────────────────────────────────────────
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  rememberMe: boolean;
  savedEmail: string;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setRememberMe: (val: boolean) => void;
}

// ── Context ──────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalıdır');
  return ctx;
}

// ── Firebase hata mesajlarını Türkçe'ye çevir ────────────
export function parseAuthError(error: AuthError): string {
  switch (error.code) {
    case 'auth/user-not-found':      return 'Bu e-posta ile kayıtlı hesap bulunamadı.';
    case 'auth/wrong-password':      return 'Şifre hatalı. Lütfen tekrar deneyin.';
    case 'auth/invalid-email':       return 'Geçersiz e-posta adresi.';
    case 'auth/email-already-in-use':return 'Bu e-posta adresi zaten kullanılıyor.';
    case 'auth/weak-password':       return 'Şifre çok zayıf. En az 6 karakter kullan.';
    case 'auth/network-request-failed': return 'İnternet bağlantını kontrol et.';
    case 'auth/too-many-requests':   return 'Çok fazla deneme. Lütfen biraz bekle.';
    case 'auth/invalid-credential':  return 'E-posta veya şifre hatalı.';
    case 'auth/operation-not-allowed': return 'E-posta girişi henüz etkinleştirilmemiş.';
    default:                         return 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }
}

// ── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  // Uygulama açılınca kayıtlı e-postayı yükle
  useEffect(() => {
    AsyncStorage.getItem(REMEMBER_KEY).then((r) => {
      if (r === 'true') {
        setRememberMeState(true);
        AsyncStorage.getItem(SAVED_EMAIL_KEY).then((e) => setSavedEmail(e ?? ''));
      }
    });
  }, []);

  // Firebase auth state dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        loadUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) setUserProfile(snap.data() as UserProfile);
    } catch (_) {}
  };

  // ── Giriş ─────────────────────────────────────────────
  const login = async (email: string, password: string, remember: boolean) => {
    await signInWithEmailAndPassword(auth, email, password);
    if (remember) {
      await AsyncStorage.setItem(REMEMBER_KEY, 'true');
      await AsyncStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      await AsyncStorage.removeItem(REMEMBER_KEY);
      await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
    }
  };

  // ── Kayıt ─────────────────────────────────────────────
  const register = async (name: string, email: string, password: string) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName: name });
    const profile: UserProfile = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: name,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', newUser.uid), profile);
    setUserProfile(profile);
  };

  // ── Çıkış ─────────────────────────────────────────────
  const logout = async () => {
    const remember = await AsyncStorage.getItem(REMEMBER_KEY);
    if (remember !== 'true') await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
    await signOut(auth);
  };

  const setRememberMe = (val: boolean) => {
    setRememberMeState(val);
    if (!val) {
      AsyncStorage.removeItem(REMEMBER_KEY);
      AsyncStorage.removeItem(SAVED_EMAIL_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, rememberMe, savedEmail,
      login, register, logout, setRememberMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
