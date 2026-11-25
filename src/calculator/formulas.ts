export function calculateVoltage(current: number, resistance: number): number {
  return current * resistance;
}

export function calculateCurrent(voltage: number, resistance: number): number {
  if (resistance === 0) return 0;
  return voltage / resistance;
}

export function calculateResistance(voltage: number, current: number): number {
  if (current === 0) return 0;
  return voltage / current;
}

export function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}
