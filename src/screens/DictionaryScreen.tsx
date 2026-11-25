import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dictionaryData from '../data/dictionary.json';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createDictionaryStyles } from '../theme/dictionaryStyles';

export type DictionaryItem = {
  id: string;
  termino: string;
  definicion: string;
  categoria: string;
};

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const CATEGORY_ICONS: Record<string, IconName> = {
  Electrónica: 'chip',
  Transmisión: 'car-shift-pattern',
  Comunicación: 'lan-connect',
  Diagnóstico: 'stethoscope',
  Sensores: 'gauge',
  Actuadores: 'cog-sync',
  Eléctrico: 'flash',
  Seguridad: 'shield-check',
  Motor: 'engine',
};

const DICTIONARY_DATA = dictionaryData as DictionaryItem[];
const CATEGORIES = Array.from(
  new Set(DICTIONARY_DATA.map((item) => item.categoria))
).sort((a, b) => a.localeCompare(b));

export function DictionaryScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createDictionaryStyles);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return DICTIONARY_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === null || item.categoria === activeCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.termino.toLowerCase().includes(query) ||
        item.definicion.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, activeCategory]);

  const hasFilters = searchQuery.trim().length > 0 || activeCategory !== null;

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
  };

  const renderItem = ({ item }: { item: DictionaryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.cardIcon,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.accentSoftBorder,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={CATEGORY_ICONS[item.categoria] ?? 'book-outline'}
            size={20}
            color={colors.accent}
          />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.term}>{item.termino}</Text>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.accentSoftBorder,
              },
            ]}
          >
            <Text style={[styles.categoryText, { color: colors.accent }]}>
              {item.categoria}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.definition}>{item.definicion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroKicker}>Diccionario técnico</Text>
          <ThemeToggle />
        </View>

        <View style={styles.heroBadge}>
          <MaterialCommunityIcons
            name="book-alphabet"
            size={26}
            color={colors.accent}
          />
        </View>
        <Text style={styles.heroTitle}>Diccionario Autotrónico</Text>
        <Text style={styles.heroSubtitle}>
          Consulta términos técnicos, sistemas y componentes del automóvil.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <MaterialCommunityIcons
              name="format-list-numbered"
              size={13}
              color={colors.textMuted}
            />
            <Text style={styles.statText}>
              {DICTIONARY_DATA.length} términos
            </Text>
          </View>
          <View style={styles.statChip}>
            <MaterialCommunityIcons
              name="shape-outline"
              size={13}
              color={colors.textMuted}
            />
            <Text style={styles.statText}>{CATEGORIES.length} categorías</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar término o definición..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 ? (
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={colors.textMuted}
            onPress={() => setSearchQuery('')}
          />
        ) : null}
      </View>

      <ScrollView
        horizontal
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[styles.chip, activeCategory === null && styles.chipActive]}
          activeOpacity={0.8}
          onPress={() => setActiveCategory(null)}
        >
          <Text
            style={[
              styles.chipText,
              activeCategory === null && styles.chipTextActive,
            ]}
          >
            Todas
          </Text>
          <Text
            style={[
              styles.chipCount,
              activeCategory === null && styles.chipCountActive,
            ]}
          >
            {DICTIONARY_DATA.length}
          </Text>
        </TouchableOpacity>

        {CATEGORIES.map((category) => {
          const active = activeCategory === category;
          const count = DICTIONARY_DATA.filter(
            (item) => item.categoria === category
          ).length;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(active ? null : category)}
            >
              <MaterialCommunityIcons
                name={CATEGORY_ICONS[category] ?? 'book-outline'}
                size={13}
                color={active ? colors.accentText : colors.textMuted}
              />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {category}
              </Text>
              <Text
                style={[styles.chipCount, active && styles.chipCountActive]}
              >
                {count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          <Text style={styles.resultsHighlight}>{filteredData.length}</Text>{' '}
          {filteredData.length === 1 ? 'resultado' : 'resultados'}
        </Text>
        {hasFilters ? (
          <TouchableOpacity onPress={clearFilters} activeOpacity={0.7}>
            <Text style={styles.clearText}>Limpiar filtros</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        style={styles.list}
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="text-search"
                size={28}
                color={colors.textMuted}
              />
            </View>
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyText}>
              No se encontraron términos para esa búsqueda o categoría.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.8}
              onPress={clearFilters}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={16}
                color={colors.accentText}
              />
              <Text style={styles.emptyButtonText}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

export default DictionaryScreen;
