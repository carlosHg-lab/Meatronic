import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePdfLibrary } from '../hooks/usePdfLibrary';
import { formatBytes } from '../utils/formatBytes';
import { BrandLogo } from '../components/BrandLogo';
import { BrandFilter, type BrandFilterValue } from '../components/BrandFilter';
import { getBrandLabel } from '../constants/carBrands';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createDiagramasStyles } from '../theme/diagramasStyles';
import type { PdfDocument } from '../services/pdfLibrary';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function DiagramRow({
  document,
  onPress,
}: {
  document: PdfDocument;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createDiagramasStyles);
  const brandLabel = getBrandLabel(document.brand);

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <BrandLogo brand={document.brand} size={46} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {document.title}
        </Text>
        <Text style={styles.rowMeta}>
          {brandLabel ? `${brandLabel} · ` : ''}
          Diagrama eléctrico ·{' '}
          {document.size === 0 ? 'Incluido' : formatBytes(document.size)}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.textMuted}
      />
    </TouchableOpacity>
  );
}

export function DiagramasScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createDiagramasStyles);
  const [selectedBrand, setSelectedBrand] = useState<BrandFilterValue>(null);
  const {
    documents,
    isExternal,
    rootName,
    loading,
    busy,
    error,
    refresh,
    chooseFolder,
    importPdfs,
  } = usePdfLibrary('diagramas');

  const filteredDocuments = useMemo(() => {
    if (selectedBrand === null) return documents;
    if (selectedBrand === 'other') {
      return documents.filter((doc) => !doc.brand);
    }
    return documents.filter((doc) => doc.brand === selectedBrand);
  }, [documents, selectedBrand]);

  const openDocument = useCallback(
    (index: number) => {
      const target = filteredDocuments[index];
      const realIndex = documents.findIndex((item) => item.id === target.id);
      navigation.navigate('PdfViewer', {
        title: target.title,
        initialIndex: realIndex >= 0 ? realIndex : 0,
        documents: documents.map((item) => ({
          uri: item.uri,
          title: item.title,
        })),
      });
    },
    [documents, filteredDocuments, navigation]
  );

  const handleImport = useCallback(async () => {
    const result = await importPdfs();
    if (result.imported > 0) {
      Alert.alert(
        'Diagramas actualizados',
        `${result.imported} PDF(s) agregado(s) a la carpeta «diagramas».`
      );
    } else if (result.failed > 0) {
      Alert.alert(
        'No se pudo importar',
        'Verifica que los archivos sean PDF y que no exista otro con el mismo nombre.'
      );
    }
  }, [importPdfs]);

  const handleChooseFolder = useCallback(async () => {
    const selected = await chooseFolder();
    if (selected) {
      Alert.alert(
        'Carpeta vinculada',
        'La app leerá los diagramas de la subcarpeta «diagramas» de esa ubicación.'
      );
    }
  }, [chooseFolder]);

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={styles.heroKicker}>Planos y esquemas</Text>
            <Text style={styles.heroTitle}>Diagramas</Text>
            <Text style={styles.heroSubtitle}>
              Consulta los diagramas PDF del dispositivo desde una lista
              pensada para planos técnicos.
            </Text>
          </View>
          <View style={styles.heroActions}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="sitemap"
                size={28}
                color={colors.accent}
              />
            </View>
            <ThemeToggle />
          </View>
        </View>
        <View style={styles.folderChip}>
          <MaterialCommunityIcons
            name="folder-open"
            size={13}
            color={colors.accent}
          />
          <Text style={styles.folderChipText} numberOfLines={1}>
            {isExternal
              ? `Carpeta: ${rootName || 'seleccionada'}`
              : 'Carpeta interna de la app'}
          </Text>
        </View>
      </View>

      {!loading && documents.length > 0 && (
        <BrandFilter
          documents={documents}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
        />
      )}

      {selectedBrand !== null && documents.length > 0 && (
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            Mostrando <Text style={styles.resultsHighlight}>{filteredDocuments.length}</Text> de {documents.length} diagramas
          </Text>
          <TouchableOpacity onPress={() => setSelectedBrand(null)} activeOpacity={0.7}>
            <Text style={styles.clearText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : filteredDocuments.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name={selectedBrand !== null ? 'filter-variant' : 'image-multiple-outline'}
            size={54}
            color={colors.accent}
          />
          <Text style={styles.emptyTitle}>
            {selectedBrand !== null ? 'Sin resultados para esta marca' : 'Sin diagramas todavía'}
          </Text>
          <Text style={styles.emptyText}>
            {selectedBrand !== null
              ? 'No hay diagramas disponibles para el filtro seleccionado.'
              : isExternal
              ? 'Coloca tus PDF en la subcarpeta «diagramas» de la carpeta elegida.'
              : 'No hay diagramas PDF disponibles en esta lista.'}
          </Text>
          {selectedBrand !== null && (
            <TouchableOpacity
              style={styles.emptyResetButton}
              activeOpacity={0.8}
              onPress={() => setSelectedBrand(null)}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={16}
                color={colors.accentText}
              />
              <Text style={styles.emptyResetText}>Mostrar todos</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <DiagramRow
              document={item}
              onPress={() => openDocument(index)}
            />
          )}
        />
      )}
    </View>
  );
}

export default DiagramasScreen;
