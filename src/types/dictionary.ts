export type DictionaryEntry = {
  id: string;
  termino: string;
  definicion: string;
  categoria: string;
};

export type EnglishExample = {
  en: string;
  es: string;
};

export type EnglishKeyword = {
  id: string;
  termino: string;
  traduccion: string;
  definicion: string;
  categoria: string;
  ejemplos: EnglishExample[];
};

export type DictionaryTab = 'terms' | 'english';

export type DictionarySort = 'alpha' | 'category';

export type DictionaryDetail =
  | { kind: 'terms'; entry: DictionaryEntry }
  | { kind: 'english'; entry: EnglishKeyword };
