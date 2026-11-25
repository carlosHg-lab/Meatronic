import { StyleSheet } from 'react-native';
import type { ThemeColors } from './colors';

export const createBottomTabsStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
    tabBarLabel: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
  });
