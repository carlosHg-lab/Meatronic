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
  placeholder: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
