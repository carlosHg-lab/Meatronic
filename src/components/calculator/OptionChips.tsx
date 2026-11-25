import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';

export type ChipOption<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  options: ChipOption<T>[];
  selected: T;
  onSelect: (id: T) => void;
};

export function OptionChips<T extends string>({
  options,
  selected,
  onSelect,
}: Props<T>) {
  const styles = useThemedStyles(createCalculatorStyles);

  return (
    <View style={styles.optionRow}>
      {options.map((option) => {
        const active = option.id === selected;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionChip, active && styles.optionChipActive]}
            activeOpacity={0.8}
            onPress={() => onSelect(option.id)}
          >
            <Text
              style={[
                styles.optionChipText,
                active && styles.optionChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default OptionChips;
