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
import type { DictionarySort } from '../../types/dictionary';

type Props = {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  categoryCounts: Record<string, number>;
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  sort: DictionarySort;
  onChangeSort: (sort: DictionarySort) => void;
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  favoritesCount: number;
  totalCount: number;
  onReset: () => void;
};

export function DictionaryFilterSheet({
  visible,
  onClose,
  categories,
  categoryCounts,
  activeCategory,
  onSelectCategory,
  sort,
  onChangeSort,
  onlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount,
  totalCount,
  onReset,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createDictionaryStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 14 }]}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Filtros y orden</Text>
              <Text style={styles.sheetSubtitle}>
                Ajusta la lista sin perder espacio de lectura.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sheetClose}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Cerrar filtros"
            >
              <MaterialCommunityIcons
                name="close"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>Ordenar por</Text>
              <View style={styles.sortRow}>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sort === 'alpha' && styles.sortOptionActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onChangeSort('alpha')}
                >
                  <MaterialCommunityIcons
                    name="sort-alphabetical-ascending"
                    size={16}
                    color={sort === 'alpha' ? colors.accent : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.sortOptionText,
                      sort === 'alpha' && styles.sortOptionTextActive,
                    ]}
                  >
                    A-Z
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sort === 'category' && styles.sortOptionActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onChangeSort('category')}
                >
                  <MaterialCommunityIcons
                    name="shape-outline"
                    size={16}
                    color={
                      sort === 'category' ? colors.accent : colors.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.sortOptionText,
                      sort === 'category' && styles.sortOptionTextActive,
                    ]}
                  >
                    Categoría
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>Categoría</Text>
              <View style={styles.categoryWrap}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    activeCategory === null && {
                      backgroundColor: colors.accentSoft,
                      borderColor: colors.accentSoftBorder,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onSelectCategory(null)}
                >
                  <MaterialCommunityIcons
                    name="view-grid-outline"
                    size={14}
                    color={
                      activeCategory === null ? colors.accent : colors.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      activeCategory === null && { color: colors.accent },
                    ]}
                  >
                    Todas
                  </Text>
                  <Text
                    style={[
                      styles.categoryChipCount,
                      activeCategory === null && { color: colors.accent },
                    ]}
                  >
                    {totalCount}
                  </Text>
                </TouchableOpacity>

                {categories.map((category) => {
                  const meta = getCategoryMeta(category);
                  const accent = isDark ? meta.dark : meta.light;
                  const active = activeCategory === category;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        active && {
                          backgroundColor: withAlpha(accent, 0.14),
                          borderColor: withAlpha(accent, 0.45),
                        },
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        onSelectCategory(active ? null : category)
                      }
                    >
                      <MaterialCommunityIcons
                        name={meta.icon}
                        size={14}
                        color={active ? accent : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          active && { color: accent },
                        ]}
                      >
                        {category}
                      </Text>
                      <Text
                        style={[
                          styles.categoryChipCount,
                          active && { color: accent },
                        ]}
                      >
                        {categoryCounts[category] ?? 0}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.sheetSection}>
              <Text style={styles.sheetSectionTitle}>Favoritos</Text>
              <TouchableOpacity
                style={[
                  styles.favToggle,
                  onlyFavorites && styles.favToggleActive,
                ]}
                activeOpacity={0.8}
                onPress={onToggleOnlyFavorites}
              >
                <MaterialCommunityIcons
                  name={onlyFavorites ? 'star' : 'star-outline'}
                  size={18}
                  color={onlyFavorites ? colors.warning : colors.textMuted}
                />
                <View style={styles.favToggleBody}>
                  <Text style={styles.favToggleText}>Solo favoritos</Text>
                  <Text style={styles.favToggleSub}>
                    {favoritesCount}{' '}
                    {favoritesCount === 1 ? 'guardado' : 'guardados'} en esta
                    sección
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={onlyFavorites ? 'check-circle' : 'circle-outline'}
                  size={20}
                  color={onlyFavorites ? colors.accent : colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <TouchableOpacity
              style={styles.sheetReset}
              activeOpacity={0.8}
              onPress={onReset}
            >
              <Text style={styles.sheetResetText}>Restablecer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetDone}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.sheetDoneText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
