import { StyleProp, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Svg, { Path } from 'react-native-svg';
import { BRAND_LOGOS, type CarBrand } from '../constants/carBrands';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createBrandLogoStyles } from '../theme/brandLogoStyles';

type BrandLogoProps = {
  brand?: CarBrand | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function BrandLogo({ brand, size = 46, style }: BrandLogoProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createBrandLogoStyles);
  const logo = brand ? BRAND_LOGOS[brand] : null;

  if (!logo) {
    return (
      <View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            backgroundColor: colors.accentSoft,
            borderColor: colors.accentSoftBorder,
            borderRadius: size <= 26 ? 4 : 6,
          },
          style,
        ]}
      >
        <MaterialCommunityIcons
          name="car"
          size={Math.round(size * 0.55)}
          color={colors.accent}
        />
      </View>
    );
  }

  const logoSize = Math.round(size * 0.68);

  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          backgroundColor: '#FFFFFF',
          borderColor: colors.border,
          borderRadius: size <= 26 ? 4 : 6,
        },
        style,
      ]}
    >
      <Svg width={logoSize} height={logoSize} viewBox={logo.viewBox}>
        {logo.paths.map((path, index) => (
          <Path
            key={`${brand}-${index}`}
            d={path.d}
            fill={path.fill ?? logo.color}
          />
        ))}
      </Svg>
    </View>
  );
}

export default BrandLogo;
