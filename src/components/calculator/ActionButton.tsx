import { Pressable, Text } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';

type Props = {
  label: string;
  onPress: () => void;
};

export function ActionButton({ label, onPress }: Props) {
  const styles = useThemedStyles(createCalculatorStyles);

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
