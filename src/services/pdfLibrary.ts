import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';

export type PdfCategory = 'manuales' | 'diagramas';

export type PdfDocument = {
  id: string;
  name: string;
  title: string;
  uri: string;
  size: number;
  category: PdfCategory;
};

export type LibrarySnapshot = {
  documents: PdfDocument[];
  isExternal: boolean;
  rootName: string;
};

export type ImportResult = {
  imported: number;
  failed: number;
};

type BundledPdf = {
  module: number;
  filename: string;
};

const ROOT_URI_KEY = '@maetronic/libraryRootUri';
const INTERNAL_FOLDER = 'Maetronic';

const BUNDLED_PDFS: Record<PdfCategory, BundledPdf[]> = {
  manuales: [
    {
      module: require('../assets/manual_4Y.pdf'),
      filename: 'manual_4Y.pdf',
    },
  ],
  diagramas: [],
};

function isPickerCancelled(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /cancel/i.test(message);
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getDisplayName(entry: { name: string }): string {
  const decoded = safeDecode(entry.name);
  const segment = decoded.split(/[\\/]/).pop();
  return segment && segment.length > 0 ? segment : decoded;
}

function stripPdfExtension(name: string): string {
  return name.replace(/\.pdf$/i, '');
}

function getInternalRoot(): Directory {
  return new Directory(Paths.document, INTERNAL_FOLDER);
}

async function getActiveRoot(): Promise<{
  root: Directory;
  isExternal: boolean;
}> {
  const storedUri = await AsyncStorage.getItem(ROOT_URI_KEY);

  if (storedUri) {
    try {
      const root = new Directory(storedUri);
      if (root.exists) {
        return { root, isExternal: true };
      }
    } catch (error) {
      console.error('No se pudo abrir la carpeta configurada:', error);
    }
    await AsyncStorage.removeItem(ROOT_URI_KEY);
  }

  const root = getInternalRoot();
  try {
    if (!root.exists) {
      root.create({ intermediates: true, idempotent: true });
    }
  } catch (error) {
    console.error('No se pudo crear la carpeta interna de documentos:', error);
  }

  return { root, isExternal: false };
}

function findChildDirectory(
  parent: Directory,
  name: string
): Directory | null {
  const target = name.toLowerCase();

  try {
    for (const entry of parent.list()) {
      if (
        entry instanceof Directory &&
        getDisplayName(entry).toLowerCase() === target
      ) {
        return entry;
      }
    }
  } catch (error) {
    console.error('No se pudo listar la carpeta de documentos:', error);
  }

  return null;
}

function ensureCategoryDirectory(
  root: Directory,
  category: PdfCategory
): Directory | null {
  const existing = findChildDirectory(root, category);
  if (existing) return existing;

  try {
    return root.createDirectory(category);
  } catch (error) {
    console.error(`No se pudo crear la carpeta "${category}":`, error);
    return findChildDirectory(root, category);
  }
}

function readCategory(
  directory: Directory | null,
  category: PdfCategory
): PdfDocument[] {
  if (!directory) return [];

  try {
    return directory
      .list()
      .filter((entry): entry is File => entry instanceof File)
      .filter((file) =>
        getDisplayName(file).toLowerCase().endsWith('.pdf')
      )
      .map((file) => {
        const name = getDisplayName(file);
        return {
          id: file.uri,
          name,
          title: stripPdfExtension(name),
          uri: file.uri,
          size: file.size,
          category,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  } catch (error) {
    console.error(`No se pudo leer la carpeta "${category}":`, error);
    return [];
  }
}

async function seedBundledDocuments(
  category: PdfCategory,
  directory: Directory
): Promise<void> {
  for (const bundled of BUNDLED_PDFS[category]) {
    try {
      const target = new File(directory, bundled.filename);
      if (target.exists) continue;

      const asset = Asset.fromModule(bundled.module);
      await asset.downloadAsync();

      const sourceUri = asset.localUri ?? asset.uri;
      if (!sourceUri) continue;

      const source = new File(sourceUri);
      await source.copy(target);
    } catch (error) {
      console.error(
        `No se pudo preparar el PDF de ejemplo (${category}):`,
        error
      );
    }
  }
}

export async function loadLibrary(
  category: PdfCategory
): Promise<LibrarySnapshot> {
  const { root, isExternal } = await getActiveRoot();
  const directory = ensureCategoryDirectory(root, category);

  if (!isExternal && directory) {
    await seedBundledDocuments(category, directory);
  }

  return {
    documents: readCategory(directory, category),
    isExternal,
    rootName: getDisplayName(root),
  };
}

export async function pickLibraryRoot(): Promise<string | null> {
  try {
    const root = await Directory.pickDirectoryAsync();
    await AsyncStorage.setItem(ROOT_URI_KEY, root.uri);
    ensureCategoryDirectory(root, 'manuales');
    ensureCategoryDirectory(root, 'diagramas');
    return getDisplayName(root);
  } catch (error) {
    if (isPickerCancelled(error)) return null;
    throw error;
  }
}

export async function resetLibraryRoot(): Promise<void> {
  await AsyncStorage.removeItem(ROOT_URI_KEY);
}

export async function importPdfDocuments(
  category: PdfCategory
): Promise<ImportResult> {
  const selection = await File.pickFileAsync({
    multipleFiles: true,
    mimeTypes: ['application/pdf'],
  });

  if (selection.canceled) {
    return { imported: 0, failed: 0 };
  }

  const { root } = await getActiveRoot();
  const directory = ensureCategoryDirectory(root, category);

  if (!directory) {
    throw new Error(
      `No se pudo acceder a la carpeta "${category}" para importar archivos.`
    );
  }

  let imported = 0;
  let failed = 0;

  for (const file of selection.result) {
    try {
      await file.copy(directory);
      imported += 1;
    } catch (error) {
      failed += 1;
      console.error(`No se pudo importar ${getDisplayName(file)}:`, error);
    }
  }

  return { imported, failed };
}
