import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { calculatorStyles as styles } from '../../theme/calculatorStyles';
import { COLORS } from '../../theme/colors';
import { formatNumber } from '../../utils/formulas';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  unit?: string;
  placeholder?: string;
  quickValues?: number[];
};

export function NumberField({
  label,
  value,
  onChangeText,
  unit,
  placeholder,
  quickValues,
}: Props) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType="decimal-pad"
          autoCorrect={false}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {quickValues && quickValues.length > 0 ? (
        <View style={styles.quickRow}>
          {quickValues.map((quickValue) => (
            <TouchableOpacity
              key={quickValue}
              style={styles.quickChip}
              activeOpacity={0.7}
              onPress={() => onChangeText(formatNumber(quickValue, 2))}
            >
              <Text style={styles.quickChipText}>
                {formatNumber(quickValue, 2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default NumberField;
