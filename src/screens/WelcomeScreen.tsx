import React from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createWelcomeStyles } from '../theme/welcomeStyles';

const { width } = Dimensions.get('window');
const GLOW_CANVAS_SIZE = width * 1.15; // Más ancho que la pantalla para evitar cualquier borde

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const styles = useThemedStyles(createWelcomeStyles);
  const { colors } = useTheme();
  const isDark = colors.background === '#0B0F17';

  // Fondo degradado continuo de arriba hacia abajo
  const backgroundGradient = isDark
    ? (['#051A3B', '#082756', '#04142E', '#020917'] as const)
    : (['#DBEAFE', '#EFF6FF', '#F1F5F9', '#E2E8F0'] as const);

  return (
    <LinearGradient
      colors={backgroundGradient}
      locations={[0, 0.25, 0.62, 1]}
      style={styles.container}
    >
      {/* Botón de tema flotante arriba a la derecha */}
      <View style={styles.topRow}>
        <ThemeToggle />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.heroSection}>
          <View style={styles.logoArea}>
            {/* Resplandor radial real con SVG: se funde al 100% sin bordes */}
            <Svg
              width={GLOW_CANVAS_SIZE}
              height={GLOW_CANVAS_SIZE}
              style={styles.radialSvg}
            >
              <Defs>
                <RadialGradient
                  id="logoGlow"
                  cx="50%"
                  cy="50%"
                  rx="50%"
                  ry="50%"
                  fx="50%"
                  fy="50%"
                >
                  <Stop
                    offset="0%"
                    stopColor={isDark ? '#00B4FF' : '#3B82F6'}
                    stopOpacity={isDark ? '0.45' : '0.28'}
                  />
                  <Stop
                    offset="45%"
                    stopColor={isDark ? '#0284C7' : '#60A5FA'}
                    stopOpacity={isDark ? '0.22' : '0.14'}
                  />
                  <Stop
                    offset="75%"
                    stopColor={isDark ? '#0369A1' : '#93C5FD'}
                    stopOpacity={isDark ? '0.07' : '0.04'}
                  />
                  <Stop
                    offset="100%"
                    stopColor={isDark ? '#051A3B' : '#EFF6FF'}
                    stopOpacity="0"
                  />
                </RadialGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width={GLOW_CANVAS_SIZE}
                height={GLOW_CANVAS_SIZE}
                fill="url(#logoGlow)"
              />
            </Svg>

            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/ImgPrin2.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.title}>
            Tu Plataforma de Información{'\n'}Técnica Automotriz
          </Text>
        </View>

        {/* Bloque inferior: Créditos + Botón circular */}
        <View style={styles.footer}>
          <View style={styles.credits}>
            <Text style={styles.creditText}>
              Desarrollador: Ismael Huanaco Carpio
            </Text>
            <Text style={styles.creditText}>Docente: Marco Paredes</Text>
            <Text style={styles.creditText}>Autotrónica — 2026</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.bottomLogoContainer,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.replace('Home')}
          >
            <View style={styles.bottomLogoCircle}>
              <Image
                source={require('../../assets/ImgSec.png')}
                style={styles.bottomLogo}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.yearText}>2026</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

export default WelcomeScreen;