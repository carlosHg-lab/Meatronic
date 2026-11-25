import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: height * 0.07,
    paddingBottom: height * 0.035,
    paddingHorizontal: 20,
  },

  /* --- SECCIÓN SUPERIOR --- */
  topSection: {
    alignItems: 'center',
    width: '100%',
  },
  logoWrapper: {
    width: width * 0.72,
    height: width * 0.72,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 18,
  },
  // Capas concéntricas para simular el brillo radial azul cian
  glowOuter: {
    position: 'absolute',
    width: width * 0.78,
    height: width * 0.78,
    borderRadius: (width * 0.78) / 2,
    backgroundColor: 'rgba(0, 168, 255, 0.08)',
  },
  glowMid: {
    position: 'absolute',
    width: width * 0.64,
    height: width * 0.64,
    borderRadius: (width * 0.64) / 2,
    backgroundColor: 'rgba(0, 195, 255, 0.16)',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 35,
    elevation: 20,
  },
  glowInner: {
    position: 'absolute',
    width: width * 0.50,
    height: width * 0.50,
    borderRadius: (width * 0.50) / 2,
    backgroundColor: 'rgba(56, 217, 255, 0.25)',
    shadowColor: '#38D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    width: '92%',
    height: '92%',
    borderRadius: 24, // Ajusta si tu imagen tiene fondo transparente (.png) o cuadrado (.jpeg)
  },
  title: {
    color: '#F0F6FC',
    fontSize: 23,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 31,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 180, 255, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  /* --- SECCIÓN INFERIOR --- */
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  credits: {
    alignItems: 'center',
    marginBottom: 18,
  },
  creditText: {
    color: '#E6EEF8',
    fontSize: 15.5,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomLogoContainer: {
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  bottomLogoCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFFFFF',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#00C8FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  yearText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: 1,
  },
});