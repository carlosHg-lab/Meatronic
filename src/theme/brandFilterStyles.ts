import { StyleSheet } from 'react-native';
import type { ThemeColors } from './colors';

export const createBrandFilterStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 0,
    },
    scrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingLeft: 10,
      paddingRight: 10,
      height: 42,
      borderRadius: 8,
      borderWidth: 1,
    },
    chipText: {
      fontSize: 13,
      fontWeight: '600',
    },
    chipTextActive: {
      fontWeight: '700',
    },
    iconBox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    countBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
      borderWidth: 1,
      minWidth: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    countText: {
      fontSize: 11,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
  });
