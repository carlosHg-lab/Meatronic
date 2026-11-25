import React from 'react';
import { Text, View } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';

export type ResultRow = {
  label: string;
  value: string;
  highlight?: boolean;
};

type Props = {
  title?: string;
  rows: ResultRow[];
};

export function ResultCard({ title, rows }: Props) {
  const styles = useThemedStyles(createCalculatorStyles);

  return (
    <View style={styles.resultCard}>
      {title ? <Text style={styles.resultTitle}>{title}</Text> : null}
      {rows.map((row) => (
        <View key={row.label} style={styles.resultRow}>
          <Text style={styles.resultLabel}>{row.label}</Text>
          <Text
            style={[
              styles.resultValue,
              row.highlight && styles.resultValueHighlight,
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default ResultCard;
