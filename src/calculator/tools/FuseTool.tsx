import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NumberField } from '../../components/calculator/NumberField';
import { OptionChips } from '../../components/calculator/OptionChips';
import { ActionButton } from '../../components/calculator/ActionButton';
import { ResultCard } from '../../components/calculator/ResultCard';
import { AlertBanner } from '../../components/calculator/AlertBanner';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';
import {
  calculateFuse,
  formatNumber,
  parseDecimal,
  type FuseLoadType,
  type FuseSolution,
} from '../../utils/formulas';

const LOAD_TYPES: { id: FuseLoadType; label: string }[] = [
  { id: 'continuous', label: 'Carga continua (125 %)' },
  { id: 'intermittent', label: 'Carga intermitente (100 %)' },
];

function buildAlert(
  solution: FuseSolution,
  installedFuse: number
): { severity: 'info' | 'success' | 'warning' | 'danger'; message: string } {
  if (solution.recommendedFuse === null) {
    return {
      severity: 'danger',
      message:
        'La corriente requerida supera la tabla de fusibles estándar. Usa un fusible de mayor capacidad o divide el circuito.',
    };
  }

  if (installedFuse > 0 && installedFuse < solution.requiredCurrent) {
    return {
      severity: 'danger',
      message: `El fusible instalado (${formatNumber(installedFuse, 1)} A) es menor que la corriente requerida (${formatNumber(solution.requiredCurrent, 1)} A). Se quemará al operar la carga.`,
    };
  }

  if (installedFuse > 0 && installedFuse > solution.recommendedFuse * 1.5) {
    return {
      severity: 'warning',
      message: `El fusible instalado (${formatNumber(installedFuse, 1)} A) está muy sobredimensionado. Podría no proteger el cableado.`,
    };
  }

  if (installedFuse > 0) {
    return {
      severity: 'success',
      message: `El fusible instalado (${formatNumber(installedFuse, 1)} A) protege correctamente la carga.`,
    };
  }

  return {
    severity: 'info',
    message: `Fusible recomendado: ${formatNumber(solution.recommendedFuse, 1)} A. Verifica también el calibre del cable.`,
  };
}

export function FuseTool() {
  const styles = useThemedStyles(createCalculatorStyles);
  const [loadCurrent, setLoadCurrent] = useState('');
  const [installedFuse, setInstalledFuse] = useState('');
  const [loadType, setLoadType] = useState<FuseLoadType>('continuous');
  const [solution, setSolution] = useState<FuseSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const result = calculateFuse(parseDecimal(loadCurrent), loadType);
    if (!result) {
      setSolution(null);
      setError('Ingresa la corriente de carga en amperios.');
      return;
    }
    setError(null);
    setSolution(result);
  };

  const installedValue = parseDecimal(installedFuse);

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Selección de Fusibles</Text>
      <Text style={styles.toolHint}>
        Calcula el fusible según la corriente de carga y el tipo de servicio.
      </Text>

      <NumberField
        label="Corriente de carga"
        unit="A"
        value={loadCurrent}
        onChangeText={setLoadCurrent}
        placeholder="Ej. 12"
        quickValues={[1, 5, 10, 20, 30, 50]}
      />

      <Text style={styles.label}>Tipo de carga</Text>
      <OptionChips
        options={LOAD_TYPES}
        selected={loadType}
        onSelect={setLoadType}
      />

      <NumberField
        label="Fusible instalado (opcional)"
        unit="A"
        value={installedFuse}
        onChangeText={setInstalledFuse}
        placeholder="Ej. 15"
        quickValues={[5, 10, 15, 20, 30, 40, 50]}
      />

      <ActionButton label="CALCULAR FUSIBLE" onPress={handleCalculate} />

      {error ? <AlertBanner severity="danger" message={error} /> : null}

      {solution ? (
        <>
          <ResultCard
            title="Protección recomendada"
            rows={[
              {
                label: 'Corriente de carga',
                value: `${formatNumber(parseDecimal(loadCurrent), 2)} A`,
              },
              {
                label: 'Factor aplicado',
                value: loadType === 'continuous' ? '125 %' : '100 %',
              },
              {
                label: 'Corriente requerida',
                value: `${formatNumber(solution.requiredCurrent, 2)} A`,
              },
              {
                label: 'Fusible recomendado',
                value:
                  solution.recommendedFuse === null
                    ? 'Fuera de tabla'
                    : `${formatNumber(solution.recommendedFuse, 1)} A`,
                highlight: true,
              },
              {
                label: 'Margen sobre la carga',
                value: `${formatNumber(solution.headroomPct, 0)} %`,
              },
            ]}
          />
          <AlertBanner {...buildAlert(solution, installedValue)} />
          <Text style={styles.note}>
            Un fusible protege el cableado, no el equipo. Comprueba la capacidad
            del conductor antes de instalar.
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default FuseTool;
