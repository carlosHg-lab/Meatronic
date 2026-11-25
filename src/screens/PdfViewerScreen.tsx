import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  NativeModules,
  Platform,
  Text,
  TouchableOpacity,
  TurboModuleRegistry,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createPdfViewerStyles } from '../theme/pdfViewerStyles';
import type { RootStackParamList } from '../navigation/types';

const LOCAL_PDF_ASSET = require('../assets/manual_4Y.pdf');

type PdfViewerScreenRouteProp = RouteProp<RootStackParamList, 'PdfViewer'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  route?: PdfViewerScreenRouteProp;
};

type PdfSource = { uri: string; cache?: boolean } | number;

const REMOTE_URI_REGEX = /^(https?|file|content|bundle-assets):\/\//i;

function getNativePdfComponent() {
  try {
    const isTurbo = TurboModuleRegistry?.get?.('ReactNativeBlobUtil');
    const isClassic =
      NativeModules?.ReactNativeBlobUtil || NativeModules?.RNBlobUtil;

    if (isTurbo || isClassic) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('react-native-pdf').default;
    }
  } catch {
    // Native module react-native-blob-util is not available in current runtime (e.g. Expo Go)
  }
  return null;
}

const PdfComponent = getNativePdfComponent();

export function PdfViewerScreen({ route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createPdfViewerStyles);

  const documents = route?.params?.documents ?? [];
  const hasMultipleDocuments = documents.length > 1;

  const [activeIndex, setActiveIndex] = useState(() => {
    if (documents.length === 0) return 0;
    const initial = route?.params?.initialIndex ?? 0;
    return Math.min(Math.max(initial, 0), documents.length - 1);
  });

  const activeDocument =
    documents.length > 0 ? documents[activeIndex] : undefined;
  const rawPath = activeDocument?.uri ?? route?.params?.pdfPath;
  const title =
    activeDocument?.title || route?.params?.title || 'Manual 4Y';

  const [pdfSource, setPdfSource] = useState<PdfSource | null>(null);
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isOpeningExternal, setIsOpeningExternal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const resolveSource = async () => {
      try {
        setError(null);
        setPdfSource(null);
        setResolvedUri(null);
        setNumPages(0);

        if (typeof rawPath === 'string' && REMOTE_URI_REGEX.test(rawPath)) {
          if (isMounted) {
            setPdfSource({
              uri: rawPath,
              cache: /^https?:/i.test(rawPath),
            });
            setResolvedUri(rawPath);
          }
          return;
        }

        const moduleRef = typeof rawPath === 'number' ? rawPath : LOCAL_PDF_ASSET;
        const asset = Asset.fromModule(moduleRef);
        await asset.downloadAsync();

        if (!isMounted) return;

        const uri = asset.localUri ?? asset.uri;
        if (!uri) {
          setError('No se pudo resolver la ruta del archivo PDF.');
          return;
        }

        setResolvedUri(uri);
        setPdfSource({ uri, cache: false });
      } catch (err) {
        if (!isMounted) return;
        console.error('Error al preparar el PDF:', err);
        setError('No se pudo cargar el archivo PDF.');
      }
    };

    resolveSource();

    return () => {
      isMounted = false;
    };
  }, [rawPath]);

  const handleOpenExternal = async () => {
    if (!resolvedUri) return;
    try {
      setIsOpeningExternal(true);

      if (!/^https?:/i.test(resolvedUri)) {
        try {
          const file = new File(resolvedUri);
          if (await File.canPreview(file)) {
            await File.preview(file, {
              title,
              mimeType: 'application/pdf',
            });
            return;
          }
        } catch (previewError) {
          console.error(
            'No se pudo abrir el PDF con el visor del dispositivo:',
            previewError
          );
        }
      }

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(resolvedUri, {
          mimeType: 'application/pdf',
          dialogTitle: title,
        });
      } else {
        setError('El sistema no soporta la previsualización externa.');
      }
    } catch (err) {
      console.error('Error al abrir PDF externamente:', err);
    } finally {
      setIsOpeningExternal(false);
    }
  };

  const goPrevious = () => {
    setActiveIndex((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) =>
      Math.min(documents.length - 1, current + 1)
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={26}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerMeta} numberOfLines={1}>
            {hasMultipleDocuments
              ? `${activeIndex + 1} de ${documents.length}`
              : 'Documento PDF'}
            {numPages > 0 ? ` · ${numPages} páginas` : ''}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <ThemeToggle />
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleOpenExternal}
            disabled={!resolvedUri || isOpeningExternal}
            activeOpacity={0.7}
          >
            {isOpeningExternal ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <MaterialCommunityIcons
                name="open-in-new"
                size={22}
                color={resolvedUri ? colors.accent : colors.textMuted}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {pdfSource ? (
        PdfComponent && Platform.OS !== 'web' ? (
          <PdfComponent
            source={pdfSource}
            enablePaging={true}
            scale={1.0}
            minScale={1.0}
            maxScale={4.0}
            style={styles.pdf}
            renderActivityIndicator={() => (
              <ActivityIndicator size="large" color={colors.accent} />
            )}
            onLoadComplete={(pages: number) => setNumPages(pages)}
            onError={(err: unknown) => {
              console.error('Error al cargar el archivo PDF nativo:', err);
              setError('No se pudo mostrar el archivo PDF integradamente.');
            }}
          />
        ) : (
          <View style={styles.errorContainer}>
            <View style={styles.fallbackCard}>
              <MaterialCommunityIcons
                name="file-pdf-box"
                size={56}
                color={colors.accent}
              />
              <Text style={styles.fallbackTitle}>{title}</Text>
              <Text style={styles.fallbackSubtext}>
                {Platform.OS === 'web'
                  ? 'La vista nativa no está disponible en la web.'
                  : 'Estás usando Expo Go. El visor nativo integrado requiere un Development Build (npx expo run:android).'}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handleOpenExternal}
                disabled={isOpeningExternal}
                activeOpacity={0.8}
              >
                {isOpeningExternal ? (
                  <ActivityIndicator color={colors.accentText} size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    Abrir PDF en visor del dispositivo
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}

      {hasMultipleDocuments ? (
        <View style={[styles.navBar, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity
            style={[
              styles.navButton,
              activeIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={goPrevious}
            disabled={activeIndex === 0}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={activeIndex === 0 ? colors.textMuted : colors.accent}
            />
            <Text
              style={[
                styles.navText,
                activeIndex === 0 && styles.navTextDisabled,
              ]}
            >
              Anterior
            </Text>
          </TouchableOpacity>

          <Text style={styles.navCounter}>
            {activeIndex + 1} / {documents.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.navButton,
              activeIndex === documents.length - 1 &&
                styles.navButtonDisabled,
            ]}
            onPress={goNext}
            disabled={activeIndex === documents.length - 1}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navText,
                activeIndex === documents.length - 1 &&
                  styles.navTextDisabled,
              ]}
            >
              Siguiente
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={
                activeIndex === documents.length - 1
                  ? colors.textMuted
                  : colors.accent
              }
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default PdfViewerScreen;
