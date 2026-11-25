export function calculateCurrent(voltage: number, resistance: number): number {
  if (resistance === 0) return 0;
  return voltage / resistance;
}

export function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}

export function parseDecimal(value: string): number {
  return parseFloat(value.replace(',', '.'));
}

export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  if (decimals <= 0) return String(Math.round(value));
  const fixed = value.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '');
  return (fixed === '' ? '0' : fixed).replace('.', ',');
}

export type OhmMode = 'vr' | 'vi' | 'ir' | 'pv' | 'pi' | 'pr';

export type OhmSolution = {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
};

export function solveOhm(
  mode: OhmMode,
  first: number,
  second: number
): OhmSolution | null {
  if (!isPositive(first) || !isPositive(second)) return null;

  let voltage = 0;
  let current = 0;
  let resistance = 0;
  let power = 0;

  switch (mode) {
    case 'vr':
      voltage = first;
      resistance = second;
      current = voltage / resistance;
      power = voltage * current;
      break;
    case 'vi':
      voltage = first;
      current = second;
      resistance = voltage / current;
      power = voltage * current;
      break;
    case 'ir':
      current = first;
      resistance = second;
      voltage = current * resistance;
      power = voltage * current;
      break;
    case 'pv':
      power = first;
      voltage = second;
      current = power / voltage;
      resistance = voltage / current;
      break;
    case 'pi':
      power = first;
      current = second;
      voltage = power / current;
      resistance = voltage / current;
      break;
    case 'pr':
      power = first;
      resistance = second;
      current = Math.sqrt(power / resistance);
      voltage = current * resistance;
      break;
    default:
      return null;
  }

  if (
    !Number.isFinite(voltage) ||
    !Number.isFinite(current) ||
    !Number.isFinite(resistance) ||
    !Number.isFinite(power)
  ) {
    return null;
  }

  return { voltage, current, resistance, power };
}

export const STANDARD_FUSES = [
  1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 100, 120, 125,
  150, 175, 200, 250, 300,
];

export type FuseLoadType = 'continuous' | 'intermittent';

export type FuseSolution = {
  requiredCurrent: number;
  recommendedFuse: number | null;
  headroomPct: number;
};

export function calculateFuse(
  loadCurrent: number,
  loadType: FuseLoadType = 'continuous'
): FuseSolution | null {
  if (!isPositive(loadCurrent)) return null;

  const factor = loadType === 'continuous' ? 1.25 : 1;
  const requiredCurrent = loadCurrent * factor;
  const recommendedFuse =
    STANDARD_FUSES.find((fuse) => fuse >= requiredCurrent) ?? null;
  const headroomPct = recommendedFuse
    ? (recommendedFuse / loadCurrent - 1) * 100
    : 0;

  return { requiredCurrent, recommendedFuse, headroomPct };
}

export type WireMaterial = 'copper' | 'aluminum';

export type WireGauge = {
  awg: string;
  mm2: number;
  ampacity: number;
};

export const WIRE_GAUGES: WireGauge[] = [
  { awg: '20', mm2: 0.52, ampacity: 5 },
  { awg: '18', mm2: 0.82, ampacity: 8 },
  { awg: '16', mm2: 1.31, ampacity: 10 },
  { awg: '14', mm2: 2.08, ampacity: 15 },
  { awg: '12', mm2: 3.31, ampacity: 20 },
  { awg: '10', mm2: 5.26, ampacity: 30 },
  { awg: '8', mm2: 8.37, ampacity: 40 },
  { awg: '6', mm2: 13.3, ampacity: 55 },
  { awg: '4', mm2: 21.2, ampacity: 70 },
  { awg: '2', mm2: 33.6, ampacity: 95 },
  { awg: '1/0', mm2: 53.5, ampacity: 150 },
  { awg: '2/0', mm2: 67.4, ampacity: 185 },
  { awg: '3/0', mm2: 85, ampacity: 220 },
  { awg: '4/0', mm2: 107, ampacity: 260 },
];

export type WireSolution = {
  requiredMm2: number;
  gauge: WireGauge | null;
  voltageDrop: number;
  dropPct: number;
  ampacityOk: boolean;
};

export function calculateWireSize(
  current: number,
  lengthM: number,
  voltage: number,
  maxDropPct: number,
  material: WireMaterial = 'copper'
): WireSolution | null {
  if (
    !isPositive(current) ||
    !isPositive(lengthM) ||
    !isPositive(voltage) ||
    !isPositive(maxDropPct)
  ) {
    return null;
  }

  const resistivity = material === 'copper' ? 0.0175 : 0.028;
  const allowableDrop = (voltage * maxDropPct) / 100;
  const requiredMm2 = (2 * lengthM * current * resistivity) / allowableDrop;

  const gauge =
    WIRE_GAUGES.find(
      (item) => item.mm2 >= requiredMm2 && item.ampacity >= current
    ) ??
    WIRE_GAUGES.find((item) => item.mm2 >= requiredMm2) ??
    null;

  if (!gauge) {
    return {
      requiredMm2,
      gauge: null,
      voltageDrop: 0,
      dropPct: 0,
      ampacityOk: false,
    };
  }

  const voltageDrop = (2 * lengthM * current * resistivity) / gauge.mm2;
  const dropPct = (voltageDrop / voltage) * 100;

  return {
    requiredMm2,
    gauge,
    voltageDrop,
    dropPct,
    ampacityOk: gauge.ampacity >= current,
  };
}

export type PwmSolution = {
  frequency: number;
  periodMs: number;
  onMs: number;
  offMs: number;
  dutyPct: number;
};

export function pwmFromFrequencyDuty(
  frequency: number,
  dutyPct: number
): PwmSolution | null {
  if (!isPositive(frequency) || dutyPct < 0 || dutyPct > 100) return null;

  const periodMs = 1000 / frequency;
  const onMs = (periodMs * dutyPct) / 100;

  return {
    frequency,
    periodMs,
    onMs,
    offMs: periodMs - onMs,
    dutyPct,
  };
}

export function pwmFromTimes(
  onMs: number,
  offMs: number
): PwmSolution | null {
  if (onMs < 0 || offMs < 0 || !isPositive(onMs + offMs)) return null;

  const periodMs = onMs + offMs;

  return {
    frequency: 1000 / periodMs,
    periodMs,
    onMs,
    offMs,
    dutyPct: (onMs / periodMs) * 100,
  };
}

export type DisplacementSolution = {
  perCylinderCc: number;
  totalCc: number;
  liters: number;
  cubicInches: number;
  boreStrokeRatio: number;
};

export function calculateDisplacement(
  boreMm: number,
  strokeMm: number,
  cylinders: number
): DisplacementSolution | null {
  if (!isPositive(boreMm) || !isPositive(strokeMm) || !isPositive(cylinders)) {
    return null;
  }

  const perCylinderCc = (Math.PI / 4) * boreMm * boreMm * strokeMm / 1000;
  const totalCc = perCylinderCc * cylinders;

  return {
    perCylinderCc,
    totalCc,
    liters: totalCc / 1000,
    cubicInches: totalCc / 16.387064,
    boreStrokeRatio: boreMm / strokeMm,
  };
}

export type CompressionSolution = {
  sweptCc: number;
  totalCc: number;
  ratio: number;
};

export function calculateCompressionRatio(
  boreMm: number,
  strokeMm: number,
  chamberCc: number
): CompressionSolution | null {
  if (!isPositive(boreMm) || !isPositive(strokeMm) || !isPositive(chamberCc)) {
    return null;
  }

  const sweptCc = (Math.PI / 4) * boreMm * boreMm * strokeMm / 1000;

  return {
    sweptCc,
    totalCc: sweptCc + chamberCc,
    ratio: (sweptCc + chamberCc) / chamberCc,
  };
}

export function chamberForTargetRatio(
  sweptCc: number,
  targetRatio: number
): number | null {
  if (!isPositive(sweptCc) || targetRatio <= 1) return null;
  return sweptCc / (targetRatio - 1);
}

export type TireSpec = {
  width: number;
  aspect: number;
  rim: number;
};

export type TireSolution = {
  sidewallMm: number;
  diameterMm: number;
  circumferenceMm: number;
  revsPerKm: number;
};

export function calculateTire(spec: TireSpec): TireSolution | null {
  if (!isPositive(spec.width) || !isPositive(spec.aspect) || !isPositive(spec.rim)) {
    return null;
  }

  const sidewallMm = (spec.width * spec.aspect) / 100;
  const diameterMm = spec.rim * 25.4 + 2 * sidewallMm;
  const circumferenceMm = Math.PI * diameterMm;

  return {
    sidewallMm,
    diameterMm,
    circumferenceMm,
    revsPerKm: 1000000 / circumferenceMm,
  };
}

export type TireComparison = {
  original: TireSolution;
  replacement: TireSolution;
  diameterDiffMm: number;
  diameterDiffPct: number;
  speedoErrorPct: number;
  actualAt100: number;
};

export function compareTires(
  original: TireSpec,
  replacement: TireSpec
): TireComparison | null {
  const originalSolution = calculateTire(original);
  const replacementSolution = calculateTire(replacement);

  if (!originalSolution || !replacementSolution) return null;

  const diameterDiffMm =
    replacementSolution.diameterMm - originalSolution.diameterMm;
  const diameterDiffPct =
    (diameterDiffMm / originalSolution.diameterMm) * 100;
  const actualAt100 =
    100 * (replacementSolution.diameterMm / originalSolution.diameterMm);

  return {
    original: originalSolution,
    replacement: replacementSolution,
    diameterDiffMm,
    diameterDiffPct,
    speedoErrorPct: actualAt100 - 100,
    actualAt100,
  };
}

export type ConverterUnit = {
  id: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

export type ConverterCategory = {
  id: string;
  label: string;
  units: ConverterUnit[];
};

const linearUnit = (
  id: string,
  label: string,
  factor: number
): ConverterUnit => ({
  id,
  label,
  toBase: (value) => value * factor,
  fromBase: (value) => value / factor,
});

export const CONVERTER_CATEGORIES: ConverterCategory[] = [
  {
    id: 'pressure',
    label: 'Presión',
    units: [
      linearUnit('psi', 'psi', 6894.757),
      linearUnit('bar', 'bar', 100000),
      linearUnit('kpa', 'kPa', 1000),
      linearUnit('mpa', 'MPa', 1000000),
      linearUnit('kgcm2', 'kg/cm²', 98066.5),
      linearUnit('atm', 'atm', 101325),
    ],
  },
  {
    id: 'torque',
    label: 'Par',
    units: [
      linearUnit('nm', 'Nm', 1),
      linearUnit('lbft', 'lb-ft', 1.355818),
      linearUnit('lbin', 'lb-in', 0.112985),
      linearUnit('kgm', 'kg-m', 9.80665),
    ],
  },
  {
    id: 'temperature',
    label: 'Temperatura',
    units: [
      { id: 'c', label: '°C', toBase: (value) => value, fromBase: (value) => value },
      {
        id: 'f',
        label: '°F',
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => (value * 9) / 5 + 32,
      },
      {
        id: 'k',
        label: 'K',
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
    ],
  },
  {
    id: 'length',
    label: 'Longitud',
    units: [
      linearUnit('mm', 'mm', 1),
      linearUnit('cm', 'cm', 10),
      linearUnit('m', 'm', 1000),
      linearUnit('in', 'in', 25.4),
      linearUnit('ft', 'ft', 304.8),
    ],
  },
  {
    id: 'volume',
    label: 'Volumen',
    units: [
      linearUnit('cc', 'cc', 1),
      linearUnit('l', 'L', 1000),
      linearUnit('ci', 'ci', 16.387064),
      linearUnit('floz', 'fl oz', 29.57353),
      linearUnit('gal', 'gal', 3785.411784),
    ],
  },
  {
    id: 'power',
    label: 'Potencia',
    units: [
      linearUnit('kw', 'kW', 1),
      linearUnit('hp', 'hp', 0.7456999),
      linearUnit('cv', 'CV', 0.7354988),
      linearUnit('w', 'W', 0.001),
    ],
  },
  {
    id: 'speed',
    label: 'Velocidad',
    units: [
      linearUnit('kmh', 'km/h', 1),
      linearUnit('mph', 'mph', 1.609344),
      linearUnit('ms', 'm/s', 3.6),
      linearUnit('kn', 'nudos', 1.852),
    ],
  },
];

export function convertValue(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): number | null {
  const category = CONVERTER_CATEGORIES.find((item) => item.id === categoryId);
  if (!category) return null;

  const fromUnit = category.units.find((item) => item.id === fromUnitId);
  const toUnit = category.units.find((item) => item.id === toUnitId);
  if (!fromUnit || !toUnit) return null;

  const result = toUnit.fromBase(fromUnit.toBase(value));
  return Number.isFinite(result) ? result : null;
}
