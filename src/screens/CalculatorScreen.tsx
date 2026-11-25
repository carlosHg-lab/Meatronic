import React, { useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { calculateCurrent, calculatePower } from '../calculator/formulas';
import { COLORS } from '../theme/colors';

export function CalculatorScreen() {
  const [voltage, setVoltage] = useState('');
  const [resistance, setResistance] = useState('');
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [powerResult, setPowerResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    Keyboard.dismiss();
    setError(null);

    const v = parseFloat(voltage.replace(',', '.'));
    const r = parseFloat(resistance.replace(',', '.'));

    if (isNaN(v) || isNaN(r)) {
      setError('Por favor ingresa valores numéricos válidos.');
      setCurrentResult(null);
      setPowerResult(null);
      return;
    }

    if (r <= 0) {
      setError('La resistencia debe ser mayor a 0.');
      setCurrentResult(null);
      setPowerResult(null);
      return;
    }

    const current = calculateCurrent(v, r);
    const power = calculatePower(v, current);

    setCurrentResult(current);
    setPowerResult(power);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Cálculos Electrónicos</Text>
        <Text style={styles.subtitle}>Ley de Ohm (Corriente y Potencia)</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Voltaje (V):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 12"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={voltage}
              onChangeText={setVoltage}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resistencia (Ω):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 4"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={resistance}
              onChangeText={setResistance}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleCalculate}
          >
            <Text style={styles.buttonText}>CALCULAR</Text>
          </Pressable>
        </View>

        {currentResult !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Resultados:</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Corriente (I):</Text>
              <Text style={styles.resultValue}>
                {currentResult.toFixed(3)} A
              </Text>
            </View>
            {powerResult !== null && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Potencia (P):</Text>
                <Text style={styles.resultValue}>
                  {powerResult.toFixed(3)} W
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default CalculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 24,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorText: {
    color: '#E63946',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginTop: 24,
    gap: 12,
  },
  resultTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  resultValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
