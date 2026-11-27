import { StyleSheet } from 'react-native';
import type { ThemeColors } from './colors';

export const createThemeToggleStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      width: 48,
      height: 48,
      borderRadius: 6,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
