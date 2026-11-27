import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BrandLogo } from './BrandLogo';
import { getBrandLabel, type CarBrand } from '../constants/carBrands';
import { useTheme } from '../theme/ThemeContext';
import type { PdfDocument } from '../services/pdfLibrary';

export type BrandFilterValue = CarBrand | 'other' | null;

export type BrandFilterProps = {
  documents: PdfDocument[];
  selectedBrand: BrandFilterValue;
  onSelectBrand: (brand: BrandFilterValue) => void;
};

export function BrandFilter({
  documents,
  selectedBrand,
  onSelectBrand,
}: BrandFilterProps) {
  const { colors } = useTheme();

  const { brandOptions, hasOther, otherCount } = useMemo(() => {
    const counts: Partial<Record<CarBrand, number>> = {};
    let unbranded = 0;

    for (const doc of documents) {
      if (doc.brand) {
        counts[doc.brand] = (counts[doc.brand] ?? 0) + 1;
      } else {
        unbranded += 1;
      }
    }

    const options = (Object.keys(counts) as CarBrand[])
      .sort((a, b) => {
        const labelA = getBrandLabel(a) ?? a;
        const labelB = getBrandLabel(b) ?? b;
        return labelA.localeCompare(labelB, 'es');
      })
      .map((brand) => ({
        brand,
        label: getBrandLabel(brand) ?? brand,
        count: counts[brand] ?? 0,
      }));

    return {
      brandOptions: options,
      hasOther: unbranded > 0,
      otherCount: unbranded,
    };
  }, [documents]);

  const isAll = selectedBrand === null;
  const isOther = selectedBrand === 'other';

  // Contrast adjustments for badges depending on whether accentText is white or dark
  const isLightAccentText = colors.accentText === '#FFFFFF';
  const activeBadgeBg = isLightAccentText
    ? 'rgba(255, 255, 255, 0.24)'
    : 'rgba(4, 21, 45, 0.16)';
  const activeIconBoxBg = isLightAccentText
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(4, 21, 45, 0.12)';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Opción "Todas" */}
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: isAll ? colors.accent : colors.surface,
            borderColor: isAll ? colors.accent : colors.border,
          },
        ]}
        activeOpacity={0.75}
        onPress={() => onSelectBrand(null)}
      >
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: isAll ? activeIconBoxBg : colors.accentSoft,
              borderColor: isAll ? 'transparent' : colors.accentSoftBorder,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="car-multiple"
            size={15}
            color={isAll ? colors.accentText : colors.accent}
          />
        </View>
        <Text
          style={[
            styles.chipText,
            { color: isAll ? colors.accentText : colors.text },
            isAll && styles.chipTextActive,
          ]}
        >
          Todas
        </Text>
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: isAll ? activeBadgeBg : colors.background,
              borderColor: isAll ? 'transparent' : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.countText,
              { color: isAll ? colors.accentText : colors.textMuted },
            ]}
          >
            {documents.length}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Marcas disponibles */}
      {brandOptions.map((opt) => {
        const active = selectedBrand === opt.brand;
        return (
          <TouchableOpacity
            key={opt.brand}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.accent : colors.surface,
                borderColor: active ? colors.accent : colors.border,
              },
            ]}
            activeOpacity={0.75}
            onPress={() => onSelectBrand(active ? null : opt.brand)}
          >
            <BrandLogo
              brand={opt.brand}
              size={24}
              style={active ? { borderColor: 'transparent' } : undefined}
            />
            <Text
              style={[
                styles.chipText,
                { color: active ? colors.accentText : colors.text },
                active && styles.chipTextActive,
              ]}
            >
              {opt.label}
            </Text>
            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor: active ? activeBadgeBg : colors.background,
                  borderColor: active ? 'transparent' : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  { color: active ? colors.accentText : colors.textMuted },
                ]}
              >
                {opt.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Opción "Otras" si existen documentos sin marca identificada */}
      {hasOther && (
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: isOther ? colors.accent : colors.surface,
              borderColor: isOther ? colors.accent : colors.border,
            },
          ]}
          activeOpacity={0.75}
          onPress={() => onSelectBrand(isOther ? null : 'other')}
        >
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: isOther ? activeIconBoxBg : colors.accentSoft,
                borderColor: isOther ? 'transparent' : colors.accentSoftBorder,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="file-document-outline"
              size={15}
              color={isOther ? colors.accentText : colors.accent}
            />
          </View>
          <Text
            style={[
              styles.chipText,
              { color: isOther ? colors.accentText : colors.text },
              isOther && styles.chipTextActive,
            ]}
          >
            Otras
          </Text>
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: isOther ? activeBadgeBg : colors.background,
                borderColor: isOther ? 'transparent' : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.countText,
                { color: isOther ? colors.accentText : colors.textMuted },
              ]}
            >
              {otherCount}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 10,
    paddingRight: 10,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    fontWeight: '700',
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

export default BrandFilter;
