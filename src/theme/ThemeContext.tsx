import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PALETTES,
  type ColorScheme,
  type ThemeColors,
  type ThemeMode,
} from './colors';

type ThemeContextValue = {
  mode: ThemeMode;
  scheme: ColorScheme;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
};

const THEME_KEY = '@maetronic/themeMode';

const MODE_ORDER: ThemeMode[] = ['light', 'dark', 'auto'];

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'auto';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('auto');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (active && isThemeMode(stored)) {
          setModeState(stored);
        }
      } catch (error) {
        console.error('No se pudo cargar el tema guardado:', error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    AsyncStorage.setItem(THEME_KEY, nextMode).catch((error) => {
      console.error('No se pudo guardar el tema:', error);
    });
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((current) => {
      const next =
        MODE_ORDER[(MODE_ORDER.indexOf(current) + 1) % MODE_ORDER.length];
      AsyncStorage.setItem(THEME_KEY, next).catch((error) => {
        console.error('No se pudo guardar el tema:', error);
      });
      return next;
    });
  }, []);

  const scheme: ColorScheme =
    mode === 'auto' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      isDark: scheme === 'dark',
      colors: PALETTES[scheme],
      setMode,
      cycleMode,
    }),
    [mode, scheme, setMode, cycleMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return value;
}

export function useThemedStyles<T>(
  factory: (colors: ThemeColors) => T
): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}
