export type ThemeMode = 'light' | 'dark' | 'auto';

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  accentSoftBorder: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
};

export const LIGHT_COLORS: ThemeColors = {
  background: '#F1F5F9',
  surface: '#FFFFFF',
  border: '#CBD5E1',
  text: '#0F172A',
  textMuted: '#475569',
  accent: '#1D4ED8',
  accentText: '#FFFFFF',
  accentSoft: '#EFF6FF',
  accentSoftBorder: '#93C5FD',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#1D4ED8',
};

export const DARK_COLORS: ThemeColors = {
  background: '#0B0F17',
  surface: '#131924',
  border: '#243044',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  accent: '#3B82F6',
  accentText: '#04152D',
  accentSoft: '#172554',
  accentSoftBorder: '#1D4ED8',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

export const PALETTES: Record<ColorScheme, ThemeColors> = {
  light: LIGHT_COLORS,
  dark: DARK_COLORS,
};
