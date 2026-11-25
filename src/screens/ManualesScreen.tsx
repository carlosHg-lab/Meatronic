import React, { useCallback } from 'react';
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
import { COLORS } from '../theme/colors';
import { manualesStyles as styles } from '../theme/manualesStyles';
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
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons
          name="file-pdf-box"
          size={26}
          color={COLORS.primary}
        />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {document.title}
        </Text>
        <Text style={styles.rowMeta}>
          {formatBytes(document.size)} · Manual
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={COLORS.textMuted}
      />
    </TouchableOpacity>
  );
}

export function ManualesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
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

  const openDocument = useCallback(
    (index: number) => {
      navigation.navigate('PdfViewer', {
        title: documents[index].title,
        initialIndex: index,
        documents: documents.map((item) => ({
          uri: item.uri,
          title: item.title,
        })),
      });
    },
    [documents, navigation]
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
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={54}
          color={COLORS.primary}
        />
        <Text style={styles.emptyTitle}>Sin manuales todavía</Text>
        <Text style={styles.emptyText}>
          {isExternal
            ? 'Agrega archivos PDF a la subcarpeta «manuales» de la carpeta elegida o usa el botón Importar PDF.'
            : 'Importa un PDF desde tu dispositivo para agregarlo a la biblioteca de manuales.'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerKicker}>BIBLIOTECA TÉCNICA</Text>
        <Text style={styles.headerTitle}>Manuales</Text>
        <Text style={styles.headerSubtitle}>
          Todos los manuales PDF disponibles en el dispositivo.
        </Text>
        <View style={styles.folderChip}>
          <MaterialCommunityIcons
            name="folder-open"
            size={13}
            color={COLORS.primary}
          />
          <Text style={styles.folderChipText} numberOfLines={1}>
            {isExternal
              ? `Carpeta: ${rootName || 'seleccionada'}`
              : 'Carpeta interna de la app'}
          </Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolbarButton, styles.toolbarButtonPrimary]}
          onPress={handleImport}
          disabled={busy}
          activeOpacity={0.8}
        >
          {busy ? (
            <ActivityIndicator size="small" color="#04152D" />
          ) : (
            <MaterialCommunityIcons name="file-plus" size={17} color="#04152D" />
          )}
          <Text
            style={[styles.toolbarButtonText, styles.toolbarButtonTextPrimary]}
          >
            Importar PDF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleChooseFolder}
          disabled={busy}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="folder-search"
            size={17}
            color={COLORS.primary}
          />
          <Text style={styles.toolbarButtonText}>
            {isExternal ? 'Cambiar carpeta' : 'Elegir carpeta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={refresh}
          disabled={busy}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={17}
            color={COLORS.primary}
          />
          <Text style={styles.toolbarButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {documents.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={documents}
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
