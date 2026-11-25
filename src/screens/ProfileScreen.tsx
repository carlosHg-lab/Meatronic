import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createProfileStyles } from '../theme/profileStyles';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type Profile = {
  nombre: string;
  carrera: string;
  numero: string;
  correo: string;
  institucion: string;
  semestre: string;
  fotoUri: string | null;
};

type ProfileFieldProps = {
  icon: IconName;
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
};

const PROFILE_KEY = '@maetronic/profile';
const AVATAR_FOLDER = 'perfil';

const EMPTY_PROFILE: Profile = {
  nombre: '',
  carrera: '',
  numero: '',
  correo: '',
  institucion: '',
  semestre: '',
  fotoUri: null,
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'M';
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function isImagePickerAsset(
  value: unknown
): value is ImagePicker.ImagePickerAsset {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { uri?: unknown }).uri === 'string'
  );
}

function getFileExtension(asset: ImagePicker.ImagePickerAsset): string {
  const fromName = asset.fileName?.split('.').pop();
  const fromUri = asset.uri.split('.').pop() ?? 'jpg';
  const raw = (fromName ?? fromUri).toLowerCase();
  const cleaned = raw.replace(/[^a-z0-9]/g, '');
  if (!cleaned) return 'jpg';
  return cleaned === 'jpeg' ? 'jpg' : cleaned;
}

async function persistAvatar(
  asset: ImagePicker.ImagePickerAsset
): Promise<string> {
  const folder = new Directory(Paths.document, AVATAR_FOLDER);
  if (!folder.exists) {
    folder.create({ intermediates: true, idempotent: true });
  }

  const target = new File(
    folder,
    `avatar-${Date.now()}.${getFileExtension(asset)}`
  );
  const source = new File(asset.uri);
  await source.copy(target);
  return target.uri;
}

function cleanupAvatars(keepUri: string | null): void {
  try {
    const folder = new Directory(Paths.document, AVATAR_FOLDER);
    if (!folder.exists) return;

    for (const entry of folder.list()) {
      if (
        entry instanceof File &&
        /^avatar[.-]/i.test(entry.name) &&
        entry.uri !== keepUri
      ) {
        entry.delete();
      }
    }
  } catch (error) {
    console.error('No se pudieron limpiar las fotos anteriores:', error);
  }
}

function ProfileField({
  icon,
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType,
  autoCapitalize = 'words',
  autoCorrect = false,
}: ProfileFieldProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createProfileStyles);

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputWrap}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={colors.textMuted}
          style={styles.fieldIcon}
        />
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  divider,
}: {
  icon: IconName;
  label: string;
  value: string;
  divider?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createProfileStyles);
  const hasValue = value.trim().length > 0;

  return (
    <View style={[styles.infoRow, divider && styles.infoRowDivider]}>
      <View style={styles.infoIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={colors.accent}
        />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, !hasValue && styles.infoValueMuted]}>
          {hasValue ? value : 'Sin registrar'}
        </Text>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createProfileStyles);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [draft, setDraft] = useState<Profile>(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_KEY);
        if (stored && active) {
          const parsed = JSON.parse(stored) as Partial<Profile>;
          const next: Profile = {
            ...EMPTY_PROFILE,
            ...parsed,
            fotoUri:
              typeof parsed.fotoUri === 'string' ? parsed.fotoUri : null,
          };
          setProfile(next);
          setDraft(next);
        }
      } catch (error) {
        console.error('No se pudo cargar el perfil local:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const pickAvatar = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tus fotos para elegir una imagen de perfil.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!isImagePickerAsset(asset)) {
        Alert.alert('Foto no disponible', 'No se pudo leer la imagen elegida.');
        return;
      }

      const uri = await persistAvatar(asset);
      setDraft((current) => ({ ...current, fotoUri: uri }));
    } catch (error) {
      console.error('No se pudo seleccionar la foto:', error);
      Alert.alert(
        'Foto no disponible',
        'No se pudo guardar la imagen seleccionada. Inténtalo de nuevo.'
      );
    }
  };

  const saveProfile = async () => {
    const nombre = draft.nombre.trim();
    const correo = draft.correo.trim();

    if (!nombre) {
      Alert.alert('Falta el nombre', 'Ingresa tu nombre para guardar el perfil.');
      return;
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      Alert.alert(
        'Correo inválido',
        'Ingresa un correo electrónico válido o déjalo vacío.'
      );
      return;
    }

    const next: Profile = {
      ...draft,
      nombre,
      carrera: draft.carrera.trim(),
      numero: draft.numero.trim(),
      correo,
      institucion: draft.institucion.trim(),
      semestre: draft.semestre.trim(),
    };

    setSaving(true);
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      cleanupAvatars(next.fotoUri);
      setProfile(next);
      setDraft(next);
      setIsEditing(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error('No se pudo guardar el perfil:', error);
      Alert.alert(
        'No se pudo guardar',
        'Ocurrió un problema al guardar tu perfil en este dispositivo.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const current = isEditing ? draft : profile;
  const displayName = current.nombre.trim() || 'Tu nombre';
  const displayCareer = current.carrera.trim() || 'Agrega tu carrera';
  const avatarUri = current.fotoUri;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroKicker}>Mi perfil</Text>
            <View style={styles.heroActions}>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.editPill}
                  activeOpacity={0.85}
                  onPress={startEditing}
                >
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={14}
                    color={colors.accent}
                  />
                  <Text style={styles.editPillText}>Editar</Text>
                </TouchableOpacity>
              )}
              <ThemeToggle />
            </View>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            activeOpacity={0.85}
            onPress={isEditing ? pickAvatar : startEditing}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>
                  {getInitials(current.nombre)}
                </Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={17}
                color={colors.accentText}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.career}>{displayCareer}</Text>

          <View style={styles.localChip}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={12}
              color={colors.accent}
            />
            <Text style={styles.localChipText}>
              Datos guardados en este dispositivo
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {isEditing ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={18}
                  color={colors.accent}
                />
                <Text style={styles.sectionTitle}>Editar perfil</Text>
              </View>

              <View style={styles.photoActions}>
                <TouchableOpacity
                  style={styles.photoButton}
                  activeOpacity={0.85}
                  onPress={pickAvatar}
                >
                  <MaterialCommunityIcons
                    name="image-plus"
                    size={16}
                    color={colors.accent}
                  />
                  <Text style={styles.photoButtonText}>Cambiar foto</Text>
                </TouchableOpacity>

                {draft.fotoUri ? (
                  <TouchableOpacity
                    style={[styles.photoButton, styles.photoButtonDanger]}
                    activeOpacity={0.85}
                    onPress={() =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        fotoUri: null,
                      }))
                    }
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={16}
                      color={colors.danger}
                    />
                    <Text
                      style={[
                        styles.photoButtonText,
                        styles.photoButtonDangerText,
                      ]}
                    >
                      Quitar
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <ProfileField
                icon="account-outline"
                label="Nombre completo"
                value={draft.nombre}
                placeholder="Ej. Ismael Huanaco"
                onChangeText={(nombre) =>
                  setDraft((currentDraft) => ({ ...currentDraft, nombre }))
                }
              />
              <ProfileField
                icon="school-outline"
                label="Carrera"
                value={draft.carrera}
                placeholder="Ej. Autotrónica"
                onChangeText={(carrera) =>
                  setDraft((currentDraft) => ({ ...currentDraft, carrera }))
                }
              />
              <ProfileField
                icon="phone-outline"
                label="Número"
                value={draft.numero}
                placeholder="Ej. +591 700 00000"
                keyboardType="phone-pad"
                onChangeText={(numero) =>
                  setDraft((currentDraft) => ({ ...currentDraft, numero }))
                }
              />
              <ProfileField
                icon="email-outline"
                label="Correo"
                value={draft.correo}
                placeholder="Ej. correo@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(correo) =>
                  setDraft((currentDraft) => ({ ...currentDraft, correo }))
                }
              />
              <ProfileField
                icon="office-building-outline"
                label="Institución"
                value={draft.institucion}
                placeholder="Ej. Universidad"
                onChangeText={(institucion) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    institucion,
                  }))
                }
              />
              <ProfileField
                icon="calendar-range"
                label="Semestre"
                value={draft.semestre}
                placeholder="Ej. 6.º semestre"
                onChangeText={(semestre) =>
                  setDraft((currentDraft) => ({ ...currentDraft, semestre }))
                }
              />

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.85}
                  onPress={cancelEditing}
                  disabled={saving}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={16}
                    color={colors.textMuted}
                  />
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.85}
                  onPress={saveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={colors.accentText} />
                  ) : (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color={colors.accentText}
                    />
                  )}
                  <Text style={styles.saveButtonText}>
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="account-details-outline"
                    size={18}
                    color={colors.accent}
                  />
                  <Text style={styles.sectionTitle}>Información personal</Text>
                </View>
                <InfoRow
                  icon="account-outline"
                  label="Nombre completo"
                  value={profile.nombre}
                  divider
                />
                <InfoRow
                  icon="phone-outline"
                  label="Número"
                  value={profile.numero}
                  divider
                />
                <InfoRow
                  icon="email-outline"
                  label="Correo"
                  value={profile.correo}
                />
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="school-outline"
                    size={18}
                    color={colors.accent}
                  />
                  <Text style={styles.sectionTitle}>Información académica</Text>
                </View>
                <InfoRow
                  icon="book-education-outline"
                  label="Carrera"
                  value={profile.carrera}
                  divider
                />
                <InfoRow
                  icon="office-building-outline"
                  label="Institución"
                  value={profile.institucion}
                  divider
                />
                <InfoRow
                  icon="calendar-range"
                  label="Semestre"
                  value={profile.semestre}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={startEditing}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={16}
                  color={colors.accentText}
                />
                <Text style={styles.saveButtonText}>Editar perfil</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;
