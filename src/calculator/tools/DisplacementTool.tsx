import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NumberField } from '../../components/calculator/NumberField';
import { ActionButton } from '../../components/calculator/ActionButton';
import { ResultCard } from '../../components/calculator/ResultCard';
import { AlertBanner } from '../../components/calculator/AlertBanner';
import { calculatorStyles as styles } from '../../theme/calculatorStyles';
import {
  calculateDisplacement,
  formatNumber,
  parseDecimal,
  type DisplacementSolution,
} from '../../utils/formulas';

function buildAlert(
  solution: DisplacementSolution
): { severity: 'info' | 'success'; message: string } {
  if (solution.liters < 1) {
    return {
      severity: 'info',
      message: 'Cilindrada pequeña: típica de motos, karts o motores auxiliares.',
    };
  }
  if (solution.liters < 2) {
    return {
      severity: 'success',
      message: 'Cilindrada compacta: habitual en autos urbanos de 3 y 4 cilindros.',
    };
  }
  if (solution.liters < 3.5) {
    return {
      severity: 'success',
      message: 'Cilindrada media: rango común en sedanes y SUV de 4 cilindros.',
    };
  }
  return {
    severity: 'info',
    message: 'Cilindrada alta: motores de 6 u 8 cilindros o vehículos de alto desempeño.',
  };
}

export function DisplacementTool() {
  const [bore, setBore] = useState('');
  const [stroke, setStroke] = useState('');
  const [cylinders, setCylinders] = useState('');
  const [solution, setSolution] = useState<DisplacementSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const result = calculateDisplacement(
      parseDecimal(bore),
      parseDecimal(stroke),
      parseDecimal(cylinders)
    );
    if (!result) {
      setSolution(null);
      setError('Ingresa diámetro, carrera y número de cilindros.');
      return;
    }
    setError(null);
    setSolution(result);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Cilindrada del Motor</Text>
      <Text style={styles.toolHint}>
        Calcula la cilindrada total a partir del diámetro, la carrera y la
        cantidad de cilindros.
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
        label="Número de cilindros"
        value={cylinders}
        onChangeText={setCylinders}
        placeholder="Ej. 4"
        quickValues={[1, 2, 3, 4, 6, 8]}
      />

      <ActionButton label="CALCULAR CILINDRADA" onPress={handleCalculate} />

      {error ? <AlertBanner severity="danger" message={error} /> : null}

      {solution ? (
        <>
          <ResultCard
            title="Resultado"
            rows={[
              {
                label: 'Cilindrada por cilindro',
                value: `${formatNumber(solution.perCylinderCc, 1)} cc`,
              },
              {
                label: 'Cilindrada total',
                value: `${formatNumber(solution.totalCc, 0)} cc`,
                highlight: true,
              },
              {
                label: 'Equivalente en litros',
                value: `${formatNumber(solution.liters, 2)} L`,
              },
              {
                label: 'Equivalente en pulgadas cúbicas',
                value: `${formatNumber(solution.cubicInches, 1)} ci`,
              },
              {
                label: 'Relación diámetro / carrera',
                value: `${formatNumber(solution.boreStrokeRatio, 2)} : 1`,
              },
            ]}
          />
          <AlertBanner {...buildAlert(solution)} />
          <Text style={styles.note}>
            Cilindrada = π / 4 × diámetro² × carrera × número de cilindros.
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default DisplacementTool;
