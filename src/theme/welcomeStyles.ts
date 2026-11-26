import { Dimensions, StyleSheet } from 'react-native';
import type { ThemeColors } from './colors';

const { width, height } = Dimensions.get('window');

const LOGO_SIZE = width * 0.68;

export const createWelcomeStyles = (colors: ThemeColors) => {
  const isDark = colors.background === '#0B0F17';

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 22,
    },
    topRow: {
      position: 'absolute',
      top: height * 0.052,
      right: 20,
      zIndex: 10,
    },
    mainContent: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: height * 0.08,
      marginTop: height * 0.015,
    },
    heroSection: {
      width: '100%',
      alignItems: 'center',
    },
    logoArea: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radialSvg: {
      position: 'absolute',
    },
    logoWrapper: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderRadius: LOGO_SIZE / 2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },
    logo: {
      width: '100%',
      height: '100%',
    },
    title: {
      marginTop: 14,
      color: isDark ? '#F1F5F9' : colors.text,
      fontSize: 22.5,
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: 30,
      letterSpacing: 0.2,
      textShadowColor: isDark ? 'rgba(2, 9, 23, 0.65)' : 'transparent',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    footer: {
      alignItems: 'center',
      width: '100%',
    },
    credits: {
      alignItems: 'center',
      marginBottom: 16,
    },
    creditText: {
      color: isDark ? '#F8FAFC' : colors.text,
      fontSize: 13.5,
      fontWeight: '700',
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: 20,
    },
    bottomLogoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    bottomLogoCircle: {
      width: 114,
      height: 114,
      borderRadius: 57,
      backgroundColor: '#FFFFFF',
      padding: 3.5,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: isDark ? '#CBD5E1' : colors.border,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 8,
    },
    bottomLogo: {
      width: '100%',
      height: '100%',
      borderRadius: 54,
    },
    yearText: {
      marginTop: 6,
      color: isDark ? '#FFFFFF' : colors.text,
      fontSize: 15,
      fontWeight: '800',
      letterSpacing: 0.8,
      fontVariant: ['tabular-nums'],
    },
  });
};