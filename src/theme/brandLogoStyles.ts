import { StyleSheet } from 'react-native';
import type { ThemeColors } from './colors';

export const createBrandLogoStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    box: {
      borderRadius: 6,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });
