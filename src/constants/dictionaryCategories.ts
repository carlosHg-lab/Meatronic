import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type CategoryMeta = {
  icon: IconName;
  light: string;
  dark: string;
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  Electrónica: { icon: 'chip', light: '#4338CA', dark: '#818CF8' },
  Transmisión: { icon: 'car-shift-pattern', light: '#B45309', dark: '#FBBF24' },
  Comunicación: { icon: 'lan-connect', light: '#0E7490', dark: '#22D3EE' },
  Diagnóstico: { icon: 'stethoscope', light: '#B91C1C', dark: '#F87171' },
  Sensores: { icon: 'gauge', light: '#047857', dark: '#34D399' },
  Actuadores: { icon: 'cog-sync', light: '#6D28D9', dark: '#A78BFA' },
  Eléctrico: { icon: 'flash', light: '#A16207', dark: '#FACC15' },
  Seguridad: { icon: 'shield-check', light: '#0F766E', dark: '#2DD4BF' },
  Motor: { icon: 'engine', light: '#C2410C', dark: '#FB923C' },
  Encendido: { icon: 'fire', light: '#BE123C', dark: '#FB7185' },
  Inyección: { icon: 'fuel', light: '#4D7C0F', dark: '#A3E635' },
  Carrocería: { icon: 'car-door', light: '#0369A1', dark: '#38BDF8' },
  'Tren motriz': { icon: 'car-wrench', light: '#A21CAF', dark: '#E879F9' },
};

export const DEFAULT_CATEGORY_META: CategoryMeta = {
  icon: 'book-outline',
  light: '#1D4ED8',
  dark: '#60A5FA',
};

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category] ?? DEFAULT_CATEGORY_META;
}

export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
