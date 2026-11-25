import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const bottomTabsStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
  },
  tabBarLabel: {
    fontSize: 11,
  },
});
