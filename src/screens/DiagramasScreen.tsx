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
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createDiagramasStyles } from '../theme/diagramasStyles';
import type { PdfDocument } from '../services/pdfLibrary';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function DiagramCard({
  document,
  onPress,
}: {
  document: PdfDocument;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createDiagramasStyles);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.cardIcon}>
        <MaterialCommunityIcons
          name="file-pdf-box"
          size={28}
          color={colors.accent}
        />
      </View>
      <Text style={styles.cardTitle} numberOfLines={3}>
        {document.title}
      </Text>
      <Text style={styles.cardMeta}>
        Diagrama · {formatBytes(document.size)}
      </Text>
    </TouchableOpacity>
  );
}

export function DiagramasScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createDiagramasStyles);
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
              Consulta los diagramas PDF del dispositivo desde una galería
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

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.action, styles.actionPrimary]}
          onPress={handleImport}
          disabled={busy}
          activeOpacity={0.8}
        >
          {busy ? (
            <ActivityIndicator size="small" color={colors.accentText} />
          ) : (
            <MaterialCommunityIcons
              name="file-plus"
              size={16}
              color={colors.accentText}
            />
          )}
          <Text style={[styles.actionText, styles.actionTextPrimary]}>
            Importar PDF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={handleChooseFolder}
          disabled={busy}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="folder-search"
            size={16}
            color={colors.accent}
          />
          <Text style={styles.actionText}>
            {isExternal ? 'Cambiar carpeta' : 'Elegir carpeta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={refresh}
          disabled={busy}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={16}
            color={colors.accent}
          />
          <Text style={styles.actionText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : documents.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="image-multiple-outline"
            size={54}
            color={colors.accent}
          />
          <Text style={styles.emptyTitle}>Sin diagramas todavía</Text>
          <Text style={styles.emptyText}>
            {isExternal
              ? 'Coloca tus PDF en la subcarpeta «diagramas» de la carpeta elegida o impórtalos con el botón Importar PDF.'
              : 'Importa los diagramas PDF desde tu dispositivo para verlos en esta galería.'}
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.grid}
          contentContainerStyle={styles.gridContent}
          data={documents}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item, index }) => (
            <DiagramCard
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
