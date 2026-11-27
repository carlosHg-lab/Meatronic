import React, { useCallback, useMemo, useState } from 'react';
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
import { createManualesStyles } from '../theme/manualesStyles';
import type { PdfDocument } from '../services/pdfLibrary';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function ManualRow({
  document,
  onPress,
}: {
  document: PdfDocument;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createManualesStyles);
  const brandLabel = getBrandLabel(document.brand);

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <BrandLogo brand={document.brand} size={44} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {document.title}
        </Text>
        <Text style={styles.rowMeta}>
          {brandLabel ? `${brandLabel} · ` : ''}
          {document.size === 0 ? 'Incluido' : formatBytes(document.size)} ·
          Manual
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

export function ManualesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createManualesStyles);
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
  } = usePdfLibrary('manuales');

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
        'Manuales actualizados',
        `${result.imported} PDF(s) agregado(s) a la carpeta «manuales».`
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
        'La app usará las subcarpetas «manuales» y «diagramas» de esa ubicación.'
      );
    }
  }, [chooseFolder]);

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      );
    }

    if (selectedBrand !== null) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={54}
            color={colors.accent}
          />
          <Text style={styles.emptyTitle}>Sin resultados para esta marca</Text>
          <Text style={styles.emptyText}>
            No hay manuales disponibles para el filtro seleccionado.
          </Text>
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
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={54}
          color={colors.accent}
        />
        <Text style={styles.emptyTitle}>Sin manuales todavía</Text>
        <Text style={styles.emptyText}>
          {isExternal
            ? 'Agrega archivos PDF a la subcarpeta «manuales» de la carpeta elegida.'
            : 'No hay manuales PDF disponibles en la biblioteca.'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerKicker}>Biblioteca técnica</Text>
          <ThemeToggle />
        </View>
        <Text style={styles.headerTitle}>Manuales</Text>
        <Text style={styles.headerSubtitle}>
          Todos los manuales PDF disponibles en el dispositivo.
        </Text>
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
            Mostrando <Text style={styles.resultsHighlight}>{filteredDocuments.length}</Text> de {documents.length} manuales
          </Text>
          <TouchableOpacity onPress={() => setSelectedBrand(null)} activeOpacity={0.7}>
            <Text style={styles.clearText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {filteredDocuments.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ManualRow
              document={item}
              onPress={() => openDocument(index)}
            />
          )}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

export default ManualesScreen;
