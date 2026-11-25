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
import * as Sharing from 'expo-sharing';
import type { RouteProp } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import { pdfViewerStyles as styles } from '../theme/pdfViewerStyles';

const LOCAL_PDF_ASSET = require('../assets/manual_4Y.pdf');

type PdfViewerRouteParams = {
  PdfViewer: {
    pdfPath?: string | number;
    title?: string;
  };
};

type PdfViewerScreenRouteProp = RouteProp<PdfViewerRouteParams, 'PdfViewer'>;

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
  const rawPath = route?.params?.pdfPath;
  const title = route?.params?.title || 'Manual 4Y';

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

        if (typeof rawPath === 'string' && REMOTE_URI_REGEX.test(rawPath)) {
          if (isMounted) {
            setPdfSource({ uri: rawPath, cache: true });
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {numPages > 0 && (
          <Text style={styles.headerPages}>{numPages} páginas</Text>
        )}
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
              <ActivityIndicator size="large" color={COLORS.primary} />
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
                color={COLORS.primary}
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
                  <ActivityIndicator color="#FFFFFF" size="small" />
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
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

export default PdfViewerScreen;
