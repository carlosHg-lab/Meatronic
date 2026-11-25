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
  formatNumber,
  parseDecimal,
  pwmFromFrequencyDuty,
  pwmFromTimes,
  type PwmSolution,
} from '../../utils/formulas';

type PwmMode = 'freq-duty' | 'times';

const MODES: { id: PwmMode; label: string }[] = [
  { id: 'freq-duty', label: 'Frecuencia + Duty' },
  { id: 'times', label: 'Ton + Toff' },
];

function buildAlert(
  solution: PwmSolution
): { severity: 'success' | 'warning'; message: string } {
  if (solution.dutyPct === 0 || solution.dutyPct === 100) {
    return {
      severity: 'warning',
      message:
        'Duty cycle en 0 % o 100 %: la señal queda fija y no hay conmutación PWM.',
    };
  }
  return {
    severity: 'success',
    message: `Señal PWM válida: ${formatNumber(solution.frequency, 1)} Hz con ${formatNumber(solution.dutyPct, 1)} % de activo.`,
  };
}

export function PwmTool() {
  const styles = useThemedStyles(createCalculatorStyles);
  const [mode, setMode] = useState<PwmMode>('freq-duty');
  const [frequency, setFrequency] = useState('');
  const [duty, setDuty] = useState('');
  const [onMs, setOnMs] = useState('');
  const [offMs, setOffMs] = useState('');
  const [solution, setSolution] = useState<PwmSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (nextMode: PwmMode) => {
    setMode(nextMode);
    setSolution(null);
    setError(null);
  };

  const handleCalculate = () => {
    const result =
      mode === 'freq-duty'
        ? pwmFromFrequencyDuty(parseDecimal(frequency), parseDecimal(duty))
        : pwmFromTimes(parseDecimal(onMs), parseDecimal(offMs));

    if (!result) {
      setSolution(null);
      setError(
        mode === 'freq-duty'
          ? 'Ingresa frecuencia mayor a 0 y duty entre 0 y 100 %.'
          : 'Ingresa tiempos Ton y Toff válidos.'
      );
      return;
    }

    setError(null);
    setSolution(result);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Duty Cycle y Frecuencia</Text>
      <Text style={styles.toolHint}>
        Calcula periodo, tiempo activo, tiempo apagado y frecuencia de una señal
        PWM.
      </Text>

      <OptionChips options={MODES} selected={mode} onSelect={handleModeChange} />

      {mode === 'freq-duty' ? (
        <>
          <NumberField
            label="Frecuencia"
            unit="Hz"
            value={frequency}
            onChangeText={setFrequency}
            placeholder="Ej. 100"
            quickValues={[50, 100, 500, 1000]}
          />
          <NumberField
            label="Duty cycle"
            unit="%"
            value={duty}
            onChangeText={setDuty}
            placeholder="Ej. 50"
            quickValues={[10, 25, 50, 75, 90]}
          />
        </>
      ) : (
        <>
          <NumberField
            label="Tiempo activo (Ton)"
            unit="ms"
            value={onMs}
            onChangeText={setOnMs}
            placeholder="Ej. 5"
            quickValues={[1, 2, 5, 10]}
          />
          <NumberField
            label="Tiempo apagado (Toff)"
            unit="ms"
            value={offMs}
            onChangeText={setOffMs}
            placeholder="Ej. 5"
            quickValues={[1, 2, 5, 10]}
          />
        </>
      )}

      <ActionButton label="CALCULAR PWM" onPress={handleCalculate} />

      {error ? <AlertBanner severity="danger" message={error} /> : null}

      {solution ? (
        <>
          <ResultCard
            title="Resultado PWM"
            rows={[
              {
                label: 'Frecuencia',
                value: `${formatNumber(solution.frequency, 2)} Hz`,
              },
              {
                label: 'Periodo',
                value: `${formatNumber(solution.periodMs, 3)} ms`,
              },
              {
                label: 'Tiempo activo (Ton)',
                value: `${formatNumber(solution.onMs, 3)} ms`,
              },
              {
                label: 'Tiempo apagado (Toff)',
                value: `${formatNumber(solution.offMs, 3)} ms`,
              },
              {
                label: 'Duty cycle',
                value: `${formatNumber(solution.dutyPct, 1)} %`,
                highlight: true,
              },
            ]}
          />
          <AlertBanner {...buildAlert(solution)} />
          <Text style={styles.note}>
            Frecuencia (Hz) = 1000 / periodo (ms) · Duty (%) = Ton / periodo ×
            100
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default PwmTool;
