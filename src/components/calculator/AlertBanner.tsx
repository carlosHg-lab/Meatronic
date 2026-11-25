import React from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { calculatorStyles as styles } from '../../theme/calculatorStyles';

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

const ICON_COLORS: Record<AlertSeverity, string> = {
  info: '#00B4D8',
  success: '#2EC4B6',
  warning: '#F4A261',
  danger: '#E63946',
};

const CONTAINER_STYLES = {
  info: styles.alertInfo,
  success: styles.alertSuccess,
  warning: styles.alertWarning,
  danger: styles.alertDanger,
};

const TEXT_STYLES = {
  info: styles.alertTextInfo,
  success: styles.alertTextSuccess,
  warning: styles.alertTextWarning,
  danger: styles.alertTextDanger,
};

export function AlertBanner({ severity, message }: Props) {
  return (
    <View style={[styles.alert, CONTAINER_STYLES[severity]]}>
      <MaterialCommunityIcons
        name={ICONS[severity]}
        size={18}
        color={ICON_COLORS[severity]}
      />
      <Text style={[styles.alertText, TEXT_STYLES[severity]]}>{message}</Text>
    </View>
  );
}

export default AlertBanner;
