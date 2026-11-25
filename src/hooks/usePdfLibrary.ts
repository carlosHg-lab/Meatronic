import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  importPdfDocuments,
  loadLibrary,
  pickLibraryRoot,
  resetLibraryRoot,
  type ImportResult,
  type LibrarySnapshot,
  type PdfCategory,
} from '../services/pdfLibrary';

const EMPTY_SNAPSHOT: LibrarySnapshot = {
  documents: [],
  isExternal: false,
  rootName: '',
};

export function usePdfLibrary(category: PdfCategory) {
  const [snapshot, setSnapshot] = useState<LibrarySnapshot>(EMPTY_SNAPSHOT);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const next = await loadLibrary(category);
      if (mountedRef.current) {
        setSnapshot(next);
      }
    } catch (err) {
      console.error('Error al cargar la biblioteca de PDFs:', err);
      if (mountedRef.current) {
        setError('No se pudo leer la biblioteca de documentos.');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [category]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const chooseFolder = useCallback(async (): Promise<boolean> => {
    try {
      setBusy(true);
      setError(null);
      const rootName = await pickLibraryRoot();
      if (!rootName) return false;
      await refresh();
      return true;
    } catch (err) {
      console.error('Error al seleccionar la carpeta de documentos:', err);
      if (mountedRef.current) {
        setError('No se pudo usar la carpeta seleccionada.');
      }
      return false;
    } finally {
      if (mountedRef.current) {
        setBusy(false);
      }
    }
  }, [refresh]);

  const useInternalFolder = useCallback(async () => {
    try {
      setBusy(true);
      await resetLibraryRoot();
      await refresh();
    } catch (err) {
      console.error('Error al volver a la carpeta interna:', err);
      if (mountedRef.current) {
        setError('No se pudo volver a la carpeta interna.');
      }
    } finally {
      if (mountedRef.current) {
        setBusy(false);
      }
    }
  }, [refresh]);

  const importPdfs = useCallback(async (): Promise<ImportResult> => {
    try {
      setBusy(true);
      setError(null);
      const result = await importPdfDocuments(category);
      await refresh();
      if (result.failed > 0 && mountedRef.current) {
        setError(
          `${result.failed} archivo(s) no se pudieron importar. Revisa que no existan con el mismo nombre.`
        );
      }
      return result;
    } catch (err) {
      console.error('Error al importar PDFs:', err);
      if (mountedRef.current) {
        setError('No se pudieron importar los archivos seleccionados.');
      }
      return { imported: 0, failed: 0 };
    } finally {
      if (mountedRef.current) {
        setBusy(false);
      }
    }
  }, [category, refresh]);

  return {
    ...snapshot,
    loading,
    busy,
    error,
    refresh,
    chooseFolder,
    useInternalFolder,
    importPdfs,
  };
}
