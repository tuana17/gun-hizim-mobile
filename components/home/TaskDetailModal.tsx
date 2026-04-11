import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Animated,
  TouchableOpacity, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Image,
  TouchableWithoutFeedback, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Task, TaskNote, Priority, PRIORITY_CONFIG } from '../../types/task';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface Props {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)   return 'Az önce';
  if (diffMin < 60)  return `${diffMin} dakika önce`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)    return `${diffH} saat önce`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} gün önce`;
}

export function TaskDetailModal({ task, visible, onClose, onUpdate }: Props) {
  const slideAnim  = useRef(new Animated.Value(800)).current;
  const bgOpacity  = useRef(new Animated.Value(0)).current;

  const [description, setDescription] = useState('');
  const [noteText, setNoteText]        = useState('');
  const [priority, setPriority]        = useState<Priority>('medium');
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle]              = useState('');

  // Task değişince state'i güncelle
  useEffect(() => {
    if (task) {
      setDescription(task.description ?? '');
      setPriority(task.priority);
      setTitle(task.title);
    }
  }, [task?.id]);

  // Açılış / kapanış animasyonu
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 800, duration: 250, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!task) return null;

  const pCfg = PRIORITY_CONFIG[priority];
  const notes: TaskNote[] = task.notes ?? [];
  const images: string[]  = task.images ?? [];

  // Açıklama kaydet
  const saveDescription = () => {
    onUpdate(task.id, { description });
  };

  // Başlığı kaydet
  const saveTitle = () => {
    if (title.trim()) onUpdate(task.id, { title: title.trim() });
    setEditingTitle(false);
  };

  // Öncelik değiştir
  const changePriority = (p: Priority) => {
    setPriority(p);
    onUpdate(task.id, { priority: p });
  };

  // Aktivite notu ekle
  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote: TaskNote = {
      id: `note_${Date.now()}`,
      text: noteText.trim(),
      createdAt: Date.now(),
    };
    onUpdate(task.id, { notes: [newNote, ...notes] });
    setNoteText('');
  };

  // Fotoğraf seç (galeri)
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf eklemek için galeri iznine ihtiyaç var.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets[0]) {
      onUpdate(task.id, { images: [...images, result.assets[0].uri] });
    }
  };

  // Kamera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera iznine ihtiyaç var.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      onUpdate(task.id, { images: [...images, result.assets[0].uri] });
    }
  };

  // Fotoğraf sil
  const removeImage = (uri: string) => {
    Alert.alert('Fotoğrafı Sil', 'Bu fotoğrafı silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () =>
        onUpdate(task.id, { images: images.filter(i => i !== uri) })
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Karartma backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: bgOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kavWrapper}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle çubuğu */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.priorityDot, { backgroundColor: pCfg.color }]} />
            {editingTitle ? (
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                onBlur={saveTitle}
                onSubmitEditing={saveTitle}
                autoFocus
                multiline
              />
            ) : (
              <TouchableOpacity onPress={() => setEditingTitle(true)} style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>{task.title}</Text>
                <Text style={styles.editHint}>Düzenlemek için dokun ✏️</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Öncelik seçici */}
          <View style={styles.priorityRow}>
            {PRIORITIES.map(p => {
              const cfg = PRIORITY_CONFIG[p];
              const active = priority === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => changePriority(p)}
                  style={[styles.priorityPill,
                    active && { backgroundColor: cfg.bg, borderColor: cfg.color }]}
                >
                  <View style={[styles.dot, { backgroundColor: cfg.color }]} />
                  <Text style={[styles.priorityPillText, active && { color: cfg.color }]}>
                    {cfg.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* İçerik */}
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Açıklama */}
            <Text style={styles.sectionLabel}>📝 Açıklama / Not</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              onBlur={saveDescription}
              placeholder="Bu görevle ilgili notlar, detaylar, müşteri bilgisi..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Fotoğraflar */}
            <Text style={styles.sectionLabel}>📷 Fotoğraflar</Text>
            <View style={styles.imageGrid}>
              {images.map((uri, idx) => (
                <TouchableOpacity
                  key={idx}
                  onLongPress={() => removeImage(uri)}
                  style={styles.imageWrap}
                >
                  <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.imageDeleteBtn}
                    onPress={() => removeImage(uri)}
                  >
                    <Text style={styles.imageDeleteIcon}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {/* Fotoğraf ekle butonları */}
              <TouchableOpacity onPress={pickImage} style={styles.addImageBtn}>
                <Text style={styles.addImageIcon}>🖼️</Text>
                <Text style={styles.addImageText}>Galeri</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto} style={styles.addImageBtn}>
                <Text style={styles.addImageIcon}>📷</Text>
                <Text style={styles.addImageText}>Kamera</Text>
              </TouchableOpacity>
            </View>

            {/* Aktivite geçmişi */}
            <Text style={styles.sectionLabel}>🕐 Aktivite Geçmişi</Text>

            {/* Not ekleme alanı */}
            <View style={styles.noteInputRow}>
              <TextInput
                style={styles.noteInput}
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Ne yaptın? (örn: Müşteriyi aradım, ödeme aldım...)"
                placeholderTextColor={COLORS.textMuted}
                onSubmitEditing={addNote}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={addNote}
                style={[styles.noteAddBtn, !noteText.trim() && styles.noteAddBtnDisabled]}
              >
                <Text style={styles.noteAddIcon}>➤</Text>
              </TouchableOpacity>
            </View>

            {/* Notlar listesi */}
            {notes.length === 0 ? (
              <View style={styles.emptyNotes}>
                <Text style={styles.emptyNotesText}>Henüz aktivite yok. İlk notunu ekle!</Text>
              </View>
            ) : (
              <View style={styles.noteList}>
                {notes.map((note, idx) => (
                  <View key={note.id} style={styles.noteItem}>
                    {/* Zaman çizgisi */}
                    <View style={styles.timeline}>
                      <View style={styles.timelineDot} />
                      {idx < notes.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    {/* Not içeriği */}
                    <View style={styles.noteContent}>
                      <Text style={styles.noteText}>{note.text}</Text>
                      <Text style={styles.noteTime}>{formatTime(note.createdAt)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000cc',
  },
  kavWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    minHeight: '60%',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: SPACING.md,
  },
  priorityDot: {
    width: 10, height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  editHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primary,
    paddingVertical: 4,
  },
  closeBtn: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  closeIcon: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },

  // Öncelik
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  priorityPillText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },

  scroll: { flex: 1 },

  // Bölüm başlığı
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Açıklama
  descriptionInput: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    fontSize: 14,
    padding: 14,
    lineHeight: 20,
    minHeight: 90,
    marginBottom: SPACING.lg,
  },

  // Fotoğraflar
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  imageWrap: {
    width: 90, height: 90,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  imageDeleteBtn: {
    position: 'absolute', top: 4, right: 4,
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#000000aa',
    alignItems: 'center', justifyContent: 'center',
  },
  imageDeleteIcon: { color: '#fff', fontSize: 10, fontWeight: '700' },
  addImageBtn: {
    width: 90, height: 90,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surfaceAlt,
    gap: 4,
  },
  addImageIcon: { fontSize: 24 },
  addImageText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },

  // Aktivite not girişi
  noteInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  noteInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noteAddBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  noteAddBtnDisabled: { backgroundColor: COLORS.border },
  noteAddIcon: { color: '#fff', fontSize: 18 },

  // Not listesi (zaman çizgisi)
  noteList: { gap: 0 },
  noteItem: {
    flexDirection: 'row',
    gap: 14,
  },
  timeline: {
    alignItems: 'center',
    width: 16,
    paddingTop: 4,
  },
  timelineDot: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primaryGlow,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginTop: 4,
    minHeight: 20,
  },
  noteContent: {
    flex: 1,
    paddingBottom: 18,
  },
  noteText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  noteTime: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  // Boş durum
  emptyNotes: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyNotesText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
