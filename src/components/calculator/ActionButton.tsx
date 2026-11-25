import React from 'react';
import { Pressable, Text } from 'react-native';
import { calculatorStyles as styles } from '../../theme/calculatorStyles';

type Props = {
  label: string;
  onPress: () => void;
};

export function ActionButton({ label, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export default ActionButton;
