import { useState } from 'react';
import { Text, View } from 'react-native';
import { NumberField } from '../../components/calculator/NumberField';
import { ActionButton } from '../../components/calculator/ActionButton';
import { ResultCard } from '../../components/calculator/ResultCard';
import { AlertBanner } from '../../components/calculator/AlertBanner';
import { useThemedStyles } from '../../theme/ThemeContext';
import { createCalculatorStyles } from '../../theme/calculatorStyles';
import {
  compareTires,
  formatNumber,
  parseDecimal,
  type TireComparison,
} from '../../utils/formulas';

function buildAlert(
  comparison: TireComparison
): { severity: 'success' | 'warning' | 'danger'; message: string } {
  const difference = Math.abs(comparison.diameterDiffPct);

  if (difference > 3) {
    return {
      severity: 'danger',
      message: `Diferencia de ${formatNumber(comparison.diameterDiffPct, 2)} %. Supera el 3 % recomendado: puede afectar ABS, velocímetro y transmisión.`,
    };
  }
  if (difference > 1.5) {
    return {
      severity: 'warning',
      message: `Diferencia de ${formatNumber(comparison.diameterDiffPct, 2)} %. Está dentro del límite, pero revisa holguras y lectura del velocímetro.`,
    };
  }
  return {
    severity: 'success',
    message: `Diferencia de ${formatNumber(comparison.diameterDiffPct, 2)} %. Equivalencia segura entre ambos neumáticos.`,
  };
}

export function TireTool() {
  const styles = useThemedStyles(createCalculatorStyles);
  const [originalWidth, setOriginalWidth] = useState('');
  const [originalAspect, setOriginalAspect] = useState('');
  const [originalRim, setOriginalRim] = useState('');
  const [newWidth, setNewWidth] = useState('');
  const [newAspect, setNewAspect] = useState('');
  const [newRim, setNewRim] = useState('');
  const [comparison, setComparison] = useState<TireComparison | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const result = compareTires(
      {
        width: parseDecimal(originalWidth),
        aspect: parseDecimal(originalAspect),
        rim: parseDecimal(originalRim),
      },
      {
        width: parseDecimal(newWidth),
        aspect: parseDecimal(newAspect),
        rim: parseDecimal(newRim),
      }
    );

    if (!result) {
      setComparison(null);
      setError('Completa las medidas de ambos neumáticos.');
      return;
    }

    setError(null);
    setComparison(result);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.toolTitle}>Equivalencia de Neumáticos</Text>
      <Text style={styles.toolHint}>
        Compara el diámetro y el velocímetro entre la medida original y una
        alternativa.
      </Text>

      <Text style={styles.label}>Neumático original</Text>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <NumberField
            label="Ancho"
            unit="mm"
            value={originalWidth}
            onChangeText={setOriginalWidth}
            placeholder="205"
            quickValues={[185, 195, 205, 215]}
          />
        </View>
        <View style={styles.gridItem}>
          <NumberField
            label="Perfil"
            unit="%"
            value={originalAspect}
            onChangeText={setOriginalAspect}
            placeholder="55"
            quickValues={[55, 60, 65, 70]}
          />
        </View>
      </View>
      <NumberField
        label="Rin original"
        unit="in"
        value={originalRim}
        onChangeText={setOriginalRim}
        placeholder="16"
        quickValues={[15, 16, 17, 18]}
      />

      <Text style={styles.label}>Neumático alternativo</Text>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <NumberField
            label="Ancho"
            unit="mm"
            value={newWidth}
            onChangeText={setNewWidth}
            placeholder="215"
            quickValues={[185, 195, 205, 215]}
          />
        </View>
        <View style={styles.gridItem}>
          <NumberField
            label="Perfil"
            unit="%"
            value={newAspect}
            onChangeText={setNewAspect}
            placeholder="50"
            quickValues={[45, 50, 55, 60]}
          />
        </View>
      </View>
      <NumberField
        label="Rin alternativo"
        unit="in"
        value={newRim}
        onChangeText={setNewRim}
        placeholder="17"
        quickValues={[15, 16, 17, 18]}
      />

      <ActionButton label="COMPARAR NEUMÁTICOS" onPress={handleCalculate} />

      {error ? <AlertBanner severity="danger" message={error} /> : null}

      {comparison ? (
        <>
          <ResultCard
            title="Comparación"
            rows={[
              {
                label: 'Diámetro original',
                value: `${formatNumber(comparison.original.diameterMm, 1)} mm`,
              },
              {
                label: 'Diámetro alternativo',
                value: `${formatNumber(comparison.replacement.diameterMm, 1)} mm`,
              },
              {
                label: 'Diferencia de diámetro',
                value: `${formatNumber(comparison.diameterDiffMm, 1)} mm`,
              },
              {
                label: 'Diferencia porcentual',
                value: `${formatNumber(comparison.diameterDiffPct, 2)} %`,
                highlight: true,
              },
              {
                label: 'Velocidad real a 100 km/h',
                value: `${formatNumber(comparison.actualAt100, 1)} km/h`,
              },
              {
                label: 'Revoluciones por km (nuevo)',
                value: `${formatNumber(comparison.replacement.revsPerKm, 0)}`,
              },
            ]}
          />
          <AlertBanner {...buildAlert(comparison)} />
          <Text style={styles.note}>
            Diámetro = rin × 25,4 + 2 × (ancho × perfil / 100).
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default TireTool;
