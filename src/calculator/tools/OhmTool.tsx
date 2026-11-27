import { useState } from 'react';
import { Text, View } from 'react-native';
import { NumberField } from '../../components/calculator/NumberField';
import { OptionChips } from '../../components/calculator/OptionChips';
import { ActionButton } from '../../components/calculator/ActionButton';
import { ResultCard } from '../../components/calculator/ResultCard';
import { AlertBanner } from '../../components/calculator/AlertBanner';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';
import {
  formatNumber,
  parseDecimal,
  solveOhm,
  type OhmMode,
  type OhmSolution,
} from '../../utils/formulas';

type ModeConfig = {
  id: OhmMode;
  label: string;
  firstLabel: string;
  firstUnit: string;
  secondLabel: string;
  secondUnit: string;
  firstQuick: number[];
  secondQuick: number[];
};

const MODES: ModeConfig[] = [
  {
    id: 'vr',
    label: 'V + R',
    firstLabel: 'Voltaje',
    firstUnit: 'V',
    secondLabel: 'Resistencia',
    secondUnit: 'Ω',
    firstQuick: [5, 12, 24, 48],
    secondQuick: [1, 4, 10, 100],
  },
  {
    id: 'vi',
    label: 'V + I',
    firstLabel: 'Voltaje',
    firstUnit: 'V',
    secondLabel: 'Corriente',
    secondUnit: 'A',
    firstQuick: [5, 12, 24, 48],
    secondQuick: [0.5, 1, 5, 10],
  },
  {
    id: 'ir',
    label: 'I + R',
    firstLabel: 'Corriente',
    firstUnit: 'A',
    secondLabel: 'Resistencia',
    secondUnit: 'Ω',
    firstQuick: [0.5, 1, 5, 10],
    secondQuick: [1, 4, 10, 100],
  },
  {
    id: 'pv',
    label: 'P + V',
    firstLabel: 'Potencia',
    firstUnit: 'W',
    secondLabel: 'Voltaje',
    secondUnit: 'V',
    firstQuick: [10, 50, 100, 500],
    secondQuick: [5, 12, 24, 48],
  },
  {
    id: 'pi',
    label: 'P + I',
    firstLabel: 'Potencia',
    firstUnit: 'W',
    secondLabel: 'Corriente',
    secondUnit: 'A',
    firstQuick: [10, 50, 100, 500],
    secondQuick: [0.5, 1, 5, 10],
  },
  {
    id: 'pr',
    label: 'P + R',
    firstLabel: 'Potencia',
    firstUnit: 'W',
    secondLabel: 'Resistencia',
    secondUnit: 'Ω',
    firstQuick: [10, 50, 100, 500],
    secondQuick: [1, 4, 10, 100],
  },
];

function buildAlert(solution: OhmSolution) {
  if (solution.voltage > 60) {
    return {
      severity: 'warning' as const,
      message: `Tensión de ${formatNumber(solution.voltage, 2)} V: verifica aislamiento y protección.`,
    };
  }
  if (solution.current > 100) {
    return {
      severity: 'warning' as const,
      message: `Corriente elevada (${formatNumber(solution.current, 2)} A): usa cable y fusible adecuados.`,
    };
  }
  if (solution.power > 1000) {
    return {
      severity: 'warning' as const,
      message: `Potencia alta (${formatNumber(solution.power, 1)} W): revisa disipación térmica.`,
    };
  }
  return {
    severity: 'success' as const,
    message: 'Cálculo consistente con la Ley de Ohm y la potencia eléctrica.',
  };
}

export function OhmTool() {
  const styles = useThemedStyles(createCalculatorStyles);
  const [mode, setMode] = useState<OhmMode>('vr');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [solution, setSolution] = useState<OhmSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = MODES.find((item) => item.id === mode) ?? MODES[0];

  const handleModeChange = (nextMode: OhmMode) => {
    setMode(nextMode);
    setFirst('');
    setSecond('');
    setSolution(null);
    setError(null);
  };

  const handleCalculate = () => {
    const result = solveOhm(mode, parseDecimal(first), parseDecimal(second));
    if (!result) {
      setSolution(null);
      setError('Ingresa dos valores numéricos mayores a 0.');
      return;
    }
    setError(null);
    setSolution(result);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Ley de Ohm y Potencia</Text>
      <Text style={styles.toolHint}>
        Elige los dos datos conocidos y obtén voltaje, corriente, resistencia y
        potencia.
      </Text>

      <OptionChips
        options={MODES.map((item) => ({ id: item.id, label: item.label }))}
        selected={mode}
        onSelect={handleModeChange}
      />

      <NumberField
        label={config.firstLabel}
        unit={config.firstUnit}
        value={first}
        onChangeText={setFirst}
        placeholder={`Ej. ${config.firstQuick[1]}`}
        quickValues={config.firstQuick}
      />

      <NumberField
        label={config.secondLabel}
        unit={config.secondUnit}
        value={second}
        onChangeText={setSecond}
        placeholder={`Ej. ${config.secondQuick[1]}`}
        quickValues={config.secondQuick}
      />

      <ActionButton label="CALCULAR" onPress={handleCalculate} />

      {error ? <AlertBanner severity="danger" message={error} /> : null}

      {solution ? (
        <>
          <ResultCard
            title="Resultados"
            rows={[
              {
                label: 'Voltaje (V)',
                value: `${formatNumber(solution.voltage, 2)} V`,
              },
              {
                label: 'Corriente (I)',
                value: `${formatNumber(solution.current, 3)} A`,
              },
              {
                label: 'Resistencia (R)',
                value: `${formatNumber(solution.resistance, 2)} Ω`,
              },
              {
                label: 'Potencia (P)',
                value: `${formatNumber(solution.power, 2)} W`,
                highlight: true,
              },
            ]}
          />
          <AlertBanner {...buildAlert(solution)} />
          <Text style={styles.note}>
            V = I × R · P = V × I · P = I² × R · P = V² / R
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default OhmTool;
