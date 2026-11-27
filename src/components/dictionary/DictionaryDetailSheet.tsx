import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { createDictionaryStyles } from '../../theme/dictionaryStyles';
import {
  getCategoryMeta,
  withAlpha,
} from '../../constants/dictionaryCategories';
import type { DictionaryDetail } from '../../types/dictionary';

type Props = {
  detail: DictionaryDetail | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
};

export function DictionaryDetailSheet({
  detail,
  isFavorite,
  onClose,
  onToggleFavorite,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createDictionaryStyles);

  const meta = detail ? getCategoryMeta(detail.entry.categoria) : null;
  const accent = meta ? (isDark ? meta.dark : meta.light) : colors.accent;
  const translation =
    detail?.kind === 'english' ? detail.entry.traduccion : null;
  const examples = detail?.kind === 'english' ? detail.entry.ejemplos : [];

  return (
    <Modal
      visible={detail !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        {detail && meta ? (
          <View
            style={[styles.detailSheet, { paddingBottom: insets.bottom + 14 }]}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.detailHeader}>
              <View
                style={[
                  styles.detailIcon,
                  {
                    backgroundColor: withAlpha(accent, isDark ? 0.16 : 0.1),
                    borderColor: withAlpha(accent, 0.4),
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={meta.icon}
                  size={24}
                  color={accent}
                />
              </View>
              <View style={styles.detailTitleWrap}>
                <Text style={styles.detailTitle}>{detail.entry.termino}</Text>
                {translation ? (
                  <Text style={styles.detailSubtitle}>{translation}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.sheetClose}
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Cerrar detalle"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.detailBadgeRow}>
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: withAlpha(accent, isDark ? 0.16 : 0.1),
                    borderColor: withAlpha(accent, 0.35),
                  },
                ]}
              >
                <View
                  style={[styles.categoryDot, { backgroundColor: accent }]}
                />
                <Text style={[styles.categoryText, { color: accent }]}>
                  {detail.entry.categoria}
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.detailScroll}
              contentContainerStyle={styles.detailScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {translation ? (
                <View style={styles.translationCard}>
                  <Text style={styles.translationLabel}>
                    Equivalente en español
                  </Text>
                  <Text style={styles.translationText}>{translation}</Text>
                </View>
              ) : null}

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>
                  {detail.kind === 'english' ? 'Contexto técnico' : 'Definición'}
                </Text>
                <Text style={styles.detailBody}>
                  {detail.entry.definicion}
                </Text>
              </View>

              {examples.length > 0 ? (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Ejemplos de manuales</Text>
                  {examples.map((example, index) => (
                    <View key={`${example.en}-${index}`} style={styles.exampleCard}>
                      <Text style={styles.exampleEn}>{example.en}</Text>
                      <Text style={styles.exampleEs}>{example.es}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.detailFooter}>
              <TouchableOpacity
                style={[
                  styles.detailFavButton,
                  isFavorite && styles.detailFavButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={onToggleFavorite}
              >
                <MaterialCommunityIcons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={18}
                  color={isFavorite ? colors.warning : colors.textMuted}
                />
                <Text
                  style={[
                    styles.detailFavText,
                    isFavorite && styles.detailFavTextActive,
                  ]}
                >
                  {isFavorite
                    ? 'Guardado en favoritos'
                    : 'Guardar en favoritos'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
