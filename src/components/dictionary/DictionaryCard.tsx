import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { createDictionaryStyles } from '../../theme/dictionaryStyles';
import {
  getCategoryMeta,
  withAlpha,
} from '../../constants/dictionaryCategories';
import type { DictionaryEntry, EnglishKeyword } from '../../types/dictionary';

type Props = {
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
} & (
  | { kind: 'terms'; item: DictionaryEntry }
  | { kind: 'english'; item: EnglishKeyword }
);

export function DictionaryCard(props: Props) {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createDictionaryStyles);
  const { item, kind, isFavorite, onPress, onToggleFavorite } = props;
  const meta = getCategoryMeta(item.categoria);
  const accent = isDark ? meta.dark : meta.light;
  const subtitle = kind === 'english' ? item.traduccion : null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${item.termino}`}
    >
      <View
        style={[
          styles.cardIcon,
          {
            backgroundColor: withAlpha(accent, isDark ? 0.16 : 0.1),
            borderColor: withAlpha(accent, 0.4),
          },
        ]}
      >
        <MaterialCommunityIcons name={meta.icon} size={20} color={accent} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTerm} numberOfLines={2}>
            {item.termino}
          </Text>
          <TouchableOpacity
            style={styles.cardFavorite}
            activeOpacity={0.7}
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'
            }
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'star' : 'star-outline'}
              size={18}
              color={isFavorite ? colors.warning : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {subtitle ? (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}

        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: withAlpha(accent, isDark ? 0.16 : 0.1),
              borderColor: withAlpha(accent, 0.35),
            },
          ]}
        >
          <View style={[styles.categoryDot, { backgroundColor: accent }]} />
          <Text style={[styles.categoryText, { color: accent }]}>
            {item.categoria}
          </Text>
        </View>

        <Text style={styles.cardPreview} numberOfLines={2}>
          {item.definicion}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
