import React from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'danger';

type Props = {
  severity: AlertSeverity;
  message: string;
};

const ICONS: Record<
  AlertSeverity,
  React.ComponentProps<typeof MaterialCommunityIcons>['name']
> = {
  info: 'information-outline',
  success: 'check-circle-outline',
  warning: 'alert-outline',
  danger: 'alert-circle-outline',
};

const CONTAINER_STYLES = {
  info: 'alertInfo',
  success: 'alertSuccess',
  warning: 'alertWarning',
  danger: 'alertDanger',
} as const;

const TEXT_STYLES = {
  info: 'alertTextInfo',
  success: 'alertTextSuccess',
  warning: 'alertTextWarning',
  danger: 'alertTextDanger',
} as const;

export function AlertBanner({ severity, message }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createCalculatorStyles);

  const iconColors: Record<AlertSeverity, string> = {
    info: colors.info,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  return (
    <View style={[styles.alert, styles[CONTAINER_STYLES[severity]]]}>
      <MaterialCommunityIcons
        name={ICONS[severity]}
        size={18}
        color={iconColors[severity]}
      />
      <Text style={[styles.alertText, styles[TEXT_STYLES[severity]]]}>
        {message}
      </Text>
    </View>
  );
}

export default AlertBanner;
