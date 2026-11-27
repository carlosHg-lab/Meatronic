import { useMemo, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dictionaryData from '../data/dictionary.json';
import englishKeywords from '../data/englishKeywords.json';
import { ThemeToggle } from '../components/ThemeToggle';
import { DictionaryCard } from '../components/dictionary/DictionaryCard';
import { DictionaryFilterSheet } from '../components/dictionary/DictionaryFilterSheet';
import { DictionaryDetailSheet } from '../components/dictionary/DictionaryDetailSheet';
import { useDictionaryFavorites } from '../hooks/useDictionaryFavorites';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createDictionaryStyles } from '../theme/dictionaryStyles';
import type {
  DictionaryDetail,
  DictionaryEntry,
  DictionarySort,
  DictionaryTab,
  EnglishKeyword,
} from '../types/dictionary';

const TERMS = dictionaryData as DictionaryEntry[];
const ENGLISH = englishKeywords as EnglishKeyword[];

function countCategories<T extends { categoria: string }>(items: T[]) {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item.categoria] = (counts[item.categoria] ?? 0) + 1;
    return counts;
  }, {});
}

function sortAlpha<T extends { termino: string }>(items: T[]) {
  return [...items].sort((a, b) => a.termino.localeCompare(b.termino));
}

function sortByCategory<T extends { termino: string; categoria: string }>(
  items: T[]
) {
  return [...items].sort(
    (a, b) =>
      a.categoria.localeCompare(b.categoria) ||
      a.termino.localeCompare(b.termino)
  );
}

function favoriteKey(tab: DictionaryTab, id: string) {
  return `${tab}:${id}`;
}

export function DictionaryScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createDictionaryStyles);
  const { favorites, toggleFavorite } = useDictionaryFavorites();

  const [tab, setTab] = useState<DictionaryTab>('terms');
  const [termQuery, setTermQuery] = useState('');
  const [englishQuery, setEnglishQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<DictionarySort>('alpha');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [detail, setDetail] = useState<DictionaryDetail | null>(null);

  const termCategories = useMemo(
    () =>
      Array.from(new Set(TERMS.map((item) => item.categoria))).sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );
  const englishCategories = useMemo(
    () =>
      Array.from(new Set(ENGLISH.map((item) => item.categoria))).sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );
  const termCategoryCounts = useMemo(() => countCategories(TERMS), []);
  const englishCategoryCounts = useMemo(() => countCategories(ENGLISH), []);

  const categories = tab === 'terms' ? termCategories : englishCategories;
  const categoryCounts =
    tab === 'terms' ? termCategoryCounts : englishCategoryCounts;
  const totalCount = tab === 'terms' ? TERMS.length : ENGLISH.length;
  const query = tab === 'terms' ? termQuery : englishQuery;
  const setQuery = tab === 'terms' ? setTermQuery : setEnglishQuery;

  const filteredTerms = useMemo(() => {
    const normalized = termQuery.trim().toLowerCase();
    const filtered = TERMS.filter((item) => {
      if (activeCategory && item.categoria !== activeCategory) return false;
      if (onlyFavorites && !favorites.has(favoriteKey('terms', item.id))) {
        return false;
      }
      if (!normalized) return true;
      return (
        item.termino.toLowerCase().includes(normalized) ||
        item.definicion.toLowerCase().includes(normalized) ||
        item.categoria.toLowerCase().includes(normalized)
      );
    });
    return sort === 'alpha' ? sortAlpha(filtered) : sortByCategory(filtered);
  }, [termQuery, activeCategory, onlyFavorites, sort, favorites]);

  const filteredEnglish = useMemo(() => {
    const normalized = englishQuery.trim().toLowerCase();
    const filtered = ENGLISH.filter((item) => {
      if (activeCategory && item.categoria !== activeCategory) return false;
      if (onlyFavorites && !favorites.has(favoriteKey('english', item.id))) {
        return false;
      }
      if (!normalized) return true;
      return (
        item.termino.toLowerCase().includes(normalized) ||
        item.traduccion.toLowerCase().includes(normalized) ||
        item.definicion.toLowerCase().includes(normalized) ||
        item.categoria.toLowerCase().includes(normalized) ||
        item.ejemplos.some(
          (example) =>
            example.en.toLowerCase().includes(normalized) ||
            example.es.toLowerCase().includes(normalized)
        )
      );
    });
    return sort === 'alpha' ? sortAlpha(filtered) : sortByCategory(filtered);
  }, [englishQuery, activeCategory, onlyFavorites, sort, favorites]);

  const favoritesCount = useMemo(() => {
    const source = tab === 'terms' ? TERMS : ENGLISH;
    return source.reduce(
      (total, item) =>
        total + (favorites.has(favoriteKey(tab, item.id)) ? 1 : 0),
      0
    );
  }, [tab, favorites]);

  const activeFilterCount =
    (activeCategory ? 1 : 0) + (onlyFavorites ? 1 : 0);
  const hasFilters =
    query.trim().length > 0 || activeCategory !== null || onlyFavorites;
  const resultCount =
    tab === 'terms' ? filteredTerms.length : filteredEnglish.length;
  const resultLabel =
    tab === 'terms'
      ? resultCount === 1
        ? 'término'
        : 'términos'
      : resultCount === 1
        ? 'palabra'
        : 'palabras';

  const detailFavoriteKey = detail
    ? favoriteKey(detail.kind, detail.entry.id)
    : null;
  const detailIsFavorite = detailFavoriteKey
    ? favorites.has(detailFavoriteKey)
    : false;

  const handleTabChange = (nextTab: DictionaryTab) => {
    if (nextTab === tab) return;
    setTab(nextTab);
    setActiveCategory(null);
  };

  const clearFilters = () => {
    if (tab === 'terms') {
      setTermQuery('');
    } else {
      setEnglishQuery('');
    }
    setActiveCategory(null);
    setOnlyFavorites(false);
    setSort('alpha');
  };

  const resetFilters = () => {
    setActiveCategory(null);
    setOnlyFavorites(false);
    setSort('alpha');
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons
          name={onlyFavorites ? 'star-outline' : 'text-search'}
          size={28}
          color={colors.textMuted}
        />
      </View>
      <Text style={styles.emptyTitle}>
        {onlyFavorites ? 'Sin favoritos todavía' : 'Sin resultados'}
      </Text>
      <Text style={styles.emptyText}>
        {onlyFavorites
          ? 'Marca términos con la estrella para guardarlos y consultarlos aquí.'
          : 'No se encontraron términos para esa búsqueda o categoría.'}
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
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleWrap}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="book-alphabet"
                size={22}
                color={colors.accent}
              />
            </View>
            <View style={styles.headerTitleContent}>
              <Text style={styles.kicker}>Diccionario técnico</Text>
              <Text style={styles.title} numberOfLines={1}>
                Autotrónico
              </Text>
            </View>
          </View>
          <ThemeToggle />
        </View>

        <View style={styles.tabSwitch}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === 'terms' && styles.tabButtonActive,
            ]}
            activeOpacity={0.8}
            onPress={() => handleTabChange('terms')}
          >
            <MaterialCommunityIcons
              name="book-alphabet"
              size={15}
              color={tab === 'terms' ? colors.accentText : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                tab === 'terms' && styles.tabTextActive,
              ]}
            >
              Términos
            </Text>
            <Text
              style={[
                styles.tabCount,
                tab === 'terms' && styles.tabCountActive,
              ]}
            >
              {TERMS.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === 'english' && styles.tabButtonActive,
            ]}
            activeOpacity={0.8}
            onPress={() => handleTabChange('english')}
          >
            <MaterialCommunityIcons
              name="translate"
              size={15}
              color={tab === 'english' ? colors.accentText : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                tab === 'english' && styles.tabTextActive,
              ]}
            >
              Inglés técnico
            </Text>
            <Text
              style={[
                styles.tabCount,
                tab === 'english' && styles.tabCountActive,
              ]}
            >
              {ENGLISH.length}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons
              name="magnify"
              size={19}
              color={colors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={
                tab === 'terms'
                  ? 'Buscar término, sigla o definición…'
                  : 'Buscar en español o inglés…'
              }
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Borrar búsqueda"
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilterCount > 0 && styles.filterButtonActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setFiltersVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Filtros y orden"
          >
            <MaterialCommunityIcons
              name="tune-variant"
              size={20}
              color={activeFilterCount > 0 ? colors.accent : colors.textMuted}
            />
            {activeFilterCount > 0 ? (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {activeFilterCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          <Text style={styles.resultsHighlight}>{resultCount}</Text>{' '}
          {resultLabel}
          {activeCategory ? ` · ${activeCategory}` : ''}
          {onlyFavorites ? ' · Favoritos' : ''}
          {sort === 'category' ? ' · Por categoría' : ''}
        </Text>
        {hasFilters ? (
          <TouchableOpacity onPress={clearFilters} activeOpacity={0.7}>
            <Text style={styles.clearText}>Limpiar</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {tab === 'terms' ? (
        <FlatList<DictionaryEntry>
          style={styles.list}
          data={filteredTerms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <DictionaryCard
              kind="terms"
              item={item}
              isFavorite={favorites.has(favoriteKey('terms', item.id))}
              onPress={() => setDetail({ kind: 'terms', entry: item })}
              onToggleFavorite={() =>
                toggleFavorite(favoriteKey('terms', item.id))
              }
            />
          )}
        />
      ) : (
        <FlatList<EnglishKeyword>
          style={styles.list}
          data={filteredEnglish}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <DictionaryCard
              kind="english"
              item={item}
              isFavorite={favorites.has(favoriteKey('english', item.id))}
              onPress={() => setDetail({ kind: 'english', entry: item })}
              onToggleFavorite={() =>
                toggleFavorite(favoriteKey('english', item.id))
              }
            />
          )}
        />
      )}

      <DictionaryFilterSheet
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        categories={categories}
        categoryCounts={categoryCounts}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        sort={sort}
        onChangeSort={setSort}
        onlyFavorites={onlyFavorites}
        onToggleOnlyFavorites={() => setOnlyFavorites((current) => !current)}
        favoritesCount={favoritesCount}
        totalCount={totalCount}
        onReset={resetFilters}
      />

      <DictionaryDetailSheet
        detail={detail}
        isFavorite={detailIsFavorite}
        onClose={() => setDetail(null)}
        onToggleFavorite={() => {
          if (detailFavoriteKey) toggleFavorite(detailFavoriteKey);
        }}
      />
    </View>
  );
}

export default DictionaryScreen;
