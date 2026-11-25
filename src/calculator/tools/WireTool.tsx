import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NumberField } from '../../components/calculator/NumberField';
import { OptionChips } from '../../components/calculator/OptionChips';
import { ActionButton } from '../../components/calculator/ActionButton';
import { ResultCard } from '../../components/calculator/ResultCard';
import { AlertBanner } from '../../components/calculator/AlertBanner';
import { calculatorStyles as styles } from '../../theme/calculatorStyles';
import {
  calculateWireSize,
  formatNumber,
  parseDecimal,
  type WireMaterial,
  type WireSolution,
} from '../../utils/formulas';

const MATERIALS: { id: WireMaterial; label: string }[] = [
  { id: 'copper', label: 'Cobre' },
  { id: 'aluminum', label: 'Aluminio' },
];

function buildAlert(
  solution: WireSolution,
  maxDropPct: number
): { severity: 'success' | 'warning' | 'danger'; message: string } {
  if (!solution.gauge) {
    return {
      severity: 'danger',
      message:
        'La sección requerida supera la tabla de calibres. Usa un cable de mayor sección o reduce la longitud.',
    };
  }

  if (!solution.ampacityOk) {
    return {
      severity: 'danger',
      message: `El calibre ${solution.gauge.awg} AWG no soporta ${formatNumber(solution.gauge.ampacity, 0)} A de forma segura. Sube de calibre.`,
    };
  }

  if (solution.dropPct > maxDropPct) {
    return {
      severity: 'warning',
      message: `La caída de tensión (${formatNumber(solution.dropPct, 2)} %) supera el límite configurado (${formatNumber(maxDropPct, 1)} %).`,
    };
  }

  return {
    severity: 'success',
    message: `Calibre ${solution.gauge.awg} AWG válido por caída de tensión y capacidad de corriente.`,
  };
}

export function WireTool() {
  const [current, setCurrent] = useState('');
  const [length, setLength] = useState('');
  const [voltage, setVoltage] = useState('');
  const [maxDrop, setMaxDrop] = useState('3');
  const [material, setMaterial] = useState<WireMaterial>('copper');
  const [solution, setSolution] = useState<WireSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const result = calculateWireSize(
      parseDecimal(current),
      parseDecimal(length),
      parseDecimal(voltage),
      parseDecimal(maxDrop),
      material
    );
    if (!result) {
      setSolution(null);
      setError('Completa corriente, longitud, tensión y caída máxima.');
      return;
    }
    setError(null);
    setSolution(result);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Calibre de Cable y Caída de Tensión</Text>
      <Text style={styles.toolHint}>
        Calcula la sección mínima para corriente continua considerando ida y
        vuelta del conductor.
      </Text>

      <NumberField
        label="Corriente del circuito"
        unit="A"
        value={current}
        onChangeText={setCurrent}
        placeholder="Ej. 20"
        quickValues={[5, 10, 20, 30, 50]}
      />

      <NumberField
        label="Longitud (una vía)"
        unit="m"
        value={length}
        onChangeText={setLength}
        placeholder="Ej. 5"
        quickValues={[1, 3, 5, 10, 20]}
      />

      <NumberField
        label="Tensión del sistema"
        unit="V"
        value={voltage}
        onChangeText={setVoltage}
        placeholder="Ej. 12"
        quickValues={[12, 24, 48]}
      />

      <NumberField
        label="Caída máxima permitida"
        unit="%"
        value={maxDrop}
        onChangeText={setMaxDrop}
        placeholder="Ej. 3"
        quickValues={[3, 5, 10]}
      />

      <Text style={styles.label}>Material</Text>
      <OptionChips
        options={MATERIALS}
        selected={material}
        onSelect={setMaterial}
      />

      <ActionButton label="CALCULAR CABLE" onPress={handleCalculate} />

      {error ? <AlertBanner severity="danger" message={error} /> : null}

      {solution ? (
        <>
          <ResultCard
            title="Resultado del cableado"
            rows={[
              {
                label: 'Sección mínima requerida',
                value: `${formatNumber(solution.requiredMm2, 2)} mm²`,
              },
              {
                label: 'Calibre recomendado',
                value: solution.gauge
                  ? `${solution.gauge.awg} AWG (${formatNumber(solution.gauge.mm2, 2)} mm²)`
                  : 'Fuera de tabla',
                highlight: true,
              },
              {
                label: 'Caída de tensión',
                value: `${formatNumber(solution.voltageDrop, 2)} V`,
              },
              {
                label: 'Caída porcentual',
                value: `${formatNumber(solution.dropPct, 2)} %`,
              },
              {
                label: 'Capacidad del calibre',
                value: solution.gauge
                  ? `${formatNumber(solution.gauge.ampacity, 0)} A`
                  : '—',
              },
            ]}
          />
          <AlertBanner
            {...buildAlert(solution, parseDecimal(maxDrop))}
          />
          <Text style={styles.note}>
            Valores de referencia para cobre/aluminio a 20 °C. Verifica siempre
            la norma y el tipo de aislamiento del vehículo.
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default WireTool;
