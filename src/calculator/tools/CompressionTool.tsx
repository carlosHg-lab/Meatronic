import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NumberField } from '../../components/calculator/NumberField';
import { ActionButton } from '../../components/calculator/ActionButton';
import { ResultCard } from '../../components/calculator/ResultCard';
import { AlertBanner } from '../../components/calculator/AlertBanner';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';
import {
  calculateCompressionRatio,
  chamberForTargetRatio,
  formatNumber,
  parseDecimal,
  type CompressionSolution,
} from '../../utils/formulas';

function buildAlert(
  solution: CompressionSolution
): { severity: 'success' | 'warning' | 'info'; message: string } {
  if (solution.ratio < 8) {
    return {
      severity: 'warning',
      message:
        'Relación de compresión baja. Revisa fugas, válvulas o sincronización.',
    };
  }
  if (solution.ratio > 14) {
    return {
      severity: 'warning',
      message:
        'Relación de compresión alta: normalmente requiere combustible de alto octanaje y control de detonación.',
    };
  }
  return {
    severity: 'success',
    message:
      'Relación de compresión dentro del rango habitual para motores de gasolina.',
  };
}

export function CompressionTool() {
  const styles = useThemedStyles(createCalculatorStyles);
  const [bore, setBore] = useState('');
  const [stroke, setStroke] = useState('');
  const [chamber, setChamber] = useState('');
  const [targetRatio, setTargetRatio] = useState('10');
  const [solution, setSolution] = useState<CompressionSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const result = calculateCompressionRatio(
      parseDecimal(bore),
      parseDecimal(stroke),
      parseDecimal(chamber)
    );
    if (!result) {
      setSolution(null);
      setError('Ingresa diámetro, carrera y volumen de cámara.');
      return;
    }
    setError(null);
    setSolution(result);
  };

  const targetChamber = solution
    ? chamberForTargetRatio(solution.sweptCc, parseDecimal(targetRatio))
    : null;

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Relación de Compresión</Text>
      <Text style={styles.toolHint}>
        Calcula la relación de compresión y el volumen de cámara necesario para
        una relación objetivo.
      </Text>

      <NumberField
        label="Diámetro del cilindro"
        unit="mm"
        value={bore}
        onChangeText={setBore}
        placeholder="Ej. 80"
        quickValues={[70, 75, 80, 85, 90, 100]}
      />

      <NumberField
        label="Carrera del pistón"
        unit="mm"
        value={stroke}
        onChangeText={setStroke}
        placeholder="Ej. 90"
        quickValues={[70, 75, 80, 90, 100]}
      />

      <NumberField
        label="Volumen de cámara de combustión"
        unit="cc"
        value={chamber}
        onChangeText={setChamber}
        placeholder="Ej. 45"
        quickValues={[30, 40, 45, 50, 60]}
      />

      <NumberField
        label="Relación objetivo"
        unit=": 1"
        value={targetRatio}
        onChangeText={setTargetRatio}
        placeholder="Ej. 10"
        quickValues={[8, 9, 10, 11, 12]}
      />

      <ActionButton label="CALCULAR COMPRESIÓN" onPress={handleCalculate} />

      {error ? <AlertBanner severity="danger" message={error} /> : null}

      {solution ? (
        <>
          <ResultCard
            title="Resultado"
            rows={[
              {
                label: 'Cilindrada unitaria',
                value: `${formatNumber(solution.sweptCc, 1)} cc`,
              },
              {
                label: 'Volumen total del cilindro',
                value: `${formatNumber(solution.totalCc, 1)} cc`,
              },
              {
                label: 'Relación de compresión',
                value: `${formatNumber(solution.ratio, 2)} : 1`,
                highlight: true,
              },
              {
                label: 'Cámara para relación objetivo',
                value:
                  targetChamber === null
                    ? '—'
                    : `${formatNumber(targetChamber, 1)} cc`,
              },
            ]}
          />
          <AlertBanner {...buildAlert(solution)} />
          <Text style={styles.note}>
            RC = (cilindrada unitaria + volumen de cámara) / volumen de cámara.
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default CompressionTool;
