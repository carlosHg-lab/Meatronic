import { StyleSheet } from 'react-native';
import type { ThemeColors } from './colors';

export const createHomeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      paddingBottom: 12,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    topKicker: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    topImageContainer: {
      alignItems: 'center',
      marginBottom: 12,
    },
    topImage: {
      width: '100%',
      height: 110,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    header: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: 22,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 14,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 14,
      marginBottom: 14,
    },
    card: {
      width: '48%',
      aspectRatio: 1,
      backgroundColor: colors.surface,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    cardLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.4,
      textAlign: 'center',
    },
    carouselSection: {
      flex: 1,
      minHeight: 0,
      alignItems: 'center',
    },
    carouselContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 6,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    carouselImage: {
      width: '100%',
      height: '100%',
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 1,
      backgroundColor: colors.border,
    },
    activeDot: {
      width: 18,
      backgroundColor: colors.accent,
    },
  });
