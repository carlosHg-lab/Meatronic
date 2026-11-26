import type { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabsParamList = {
  Inicio: undefined;
  Manuales: undefined;
  Diagramas: undefined;
  Diccionario: undefined;
  Perfil: undefined;
  Calculadora: undefined;
};

export type PdfDocumentRef = {
  uri: string | number;
  title: string;
};

export type PdfViewerParams = {
  pdfPath?: string | number;
  title?: string;
  documents?: PdfDocumentRef[];
  initialIndex?: number;
};

export type RootStackParamList = {
  Welcome: undefined;
  Home: NavigatorScreenParams<BottomTabsParamList> | undefined;
  PdfViewer: PdfViewerParams;
};
