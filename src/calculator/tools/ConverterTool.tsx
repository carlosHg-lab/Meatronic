import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NumberField } from '../../components/calculator/NumberField';
import { OptionChips } from '../../components/calculator/OptionChips';
import { ResultCard } from '../../components/calculator/ResultCard';
import { AlertBanner } from '../../components/calculator/AlertBanner';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';
import {
  CONVERTER_CATEGORIES,
  convertValue,
  formatNumber,
  parseDecimal,
} from '../../utils/formulas';

const INITIAL_CATEGORY = CONVERTER_CATEGORIES[0];

export function ConverterTool() {
  const styles = useThemedStyles(createCalculatorStyles);
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORY.id);
  const [fromUnitId, setFromUnitId] = useState(INITIAL_CATEGORY.units[0].id);
  const [toUnitId, setToUnitId] = useState(INITIAL_CATEGORY.units[1].id);
  const [value, setValue] = useState('');

  const category =
    CONVERTER_CATEGORIES.find((item) => item.id === categoryId) ??
    INITIAL_CATEGORY;
  const fromUnit =
    category.units.find((item) => item.id === fromUnitId) ?? category.units[0];
  const toUnit =
    category.units.find((item) => item.id === toUnitId) ?? category.units[1];

  const numericValue = parseDecimal(value);
  const result = useMemo(() => {
    if (!Number.isFinite(numericValue)) return null;
    return convertValue(categoryId, fromUnitId, toUnitId, numericValue);
  }, [categoryId, fromUnitId, toUnitId, numericValue]);

  const handleCategoryChange = (nextCategoryId: string) => {
    const nextCategory = CONVERTER_CATEGORIES.find(
      (item) => item.id === nextCategoryId
    );
    if (!nextCategory) return;
    setCategoryId(nextCategory.id);
    setFromUnitId(nextCategory.units[0].id);
    setToUnitId(nextCategory.units[1]?.id ?? nextCategory.units[0].id);
  };

  const handleSwap = () => {
    setFromUnitId(toUnit.id);
    setToUnitId(fromUnit.id);
  };

  const quickValues = category.id === 'temperature' ? [-40, 0, 20, 100] : [1, 10, 50, 100];

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Conversor de Taller</Text>
      <Text style={styles.toolHint}>
        Conversiones rápidas de presión, par, temperatura, longitud, volumen,
        potencia y velocidad.
      </Text>

      <OptionChips
        options={CONVERTER_CATEGORIES.map((item) => ({
          id: item.id,
          label: item.label,
        }))}
        selected={categoryId}
        onSelect={handleCategoryChange}
      />

      <Text style={styles.label}>Convertir de</Text>
      <OptionChips
        options={category.units.map((item) => ({
          id: item.id,
          label: item.label,
        }))}
        selected={fromUnit.id}
        onSelect={setFromUnitId}
      />

      <NumberField
        label="Valor"
        unit={fromUnit.label}
        value={value}
        onChangeText={setValue}
        placeholder="Ej. 1"
        quickValues={quickValues}
      />

      <Text style={styles.label}>Convertir a</Text>
      <OptionChips
        options={category.units.map((item) => ({
          id: item.id,
          label: item.label,
        }))}
        selected={toUnit.id}
        onSelect={setToUnitId}
      />

      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSwap}
      >
        <Text style={styles.secondaryButtonText}>INTERCAMBIAR UNIDADES</Text>
      </Pressable>

      {!Number.isFinite(numericValue) ? (
        <AlertBanner severity="info" message="Ingresa un valor para convertir." />
      ) : result === null ? (
        <AlertBanner
          severity="danger"
          message="No se pudo realizar la conversión."
        />
      ) : (
        <ResultCard
          title="Resultado"
          rows={[
            {
              label: 'Valor original',
              value: `${formatNumber(numericValue, 4)} ${fromUnit.label}`,
            },
            {
              label: 'Valor convertido',
              value: `${formatNumber(result, 4)} ${toUnit.label}`,
              highlight: true,
            },
          ]}
        />
      )}
    </View>
  );
}

export default ConverterTool;
