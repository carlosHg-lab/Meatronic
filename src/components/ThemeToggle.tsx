import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeMode } from '../theme/colors';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const MODE_ICONS: Record<ThemeMode, IconName> = {
  light: 'white-balance-sunny',
  dark: 'weather-night',
  auto: 'theme-light-dark',
};

const MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Claro',
  dark: 'Nocturno',
  auto: 'Automático',
};

const NEXT_LABELS: Record<ThemeMode, string> = {
  light: 'Nocturno',
  dark: 'Automático',
  auto: 'Claro',
};

export function ThemeToggle() {
  const { mode, colors, cycleMode } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={cycleMode}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Tema ${MODE_LABELS[mode]}. Cambiar a ${NEXT_LABELS[mode]}.`}
    >
      <MaterialCommunityIcons
        name={MODE_ICONS[mode]}
        size={20}
        color={colors.accent}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemeToggle;
