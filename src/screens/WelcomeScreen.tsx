import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createWelcomeStyles } from '../theme/welcomeStyles';

const { width } = Dimensions.get('window');
const GLOW_CANVAS_SIZE = width * 1.15;

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const styles = useThemedStyles(createWelcomeStyles);
  const { colors } = useTheme();
  const isDark = colors.background === '#0B0F17';

  // Valores animados para entrada rápida + frenada brusca
  const translateX = useRef(new Animated.Value(-width * 1.2)).current;
  const tilt = useRef(new Animated.Value(-1)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Animación de entrada
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 95,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(tilt, {
            toValue: -1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(tilt, {
            toValue: 1,
            duration: 140,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(tilt, {
            toValue: 0,
            tension: 120,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            tension: 100,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [glowOpacity, scale, tilt, translateX]);

  // Redirección automática después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const rotateInterpolate = tilt.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-14deg', '0deg', '10deg'],
  });

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
            <Animated.View
              style={[styles.radialSvg, { opacity: glowOpacity }]}
            >
              <Svg width={GLOW_CANVAS_SIZE} height={GLOW_CANVAS_SIZE}>
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
            </Animated.View>

            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  transform: [
                    { translateX },
                    { rotate: rotateInterpolate },
                    { scale },
                  ],
                },
              ]}
            >
              <Image
                source={require('../../assets/ImgPrin2.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          <Text style={styles.title}>
            Tu Plataforma de Información{'\n'}Técnica Automotriz
          </Text>
        </View>

        {/* Bloque inferior: Créditos + Escudo institucional */}
        <View style={styles.footer}>
          <View style={styles.credits}>
            <Text style={styles.creditText}>
              Desarrollador: Ismael Huanaco Carpio
            </Text>
            <Text style={styles.creditText}>Docente: Marco Antonio Paredes Ochoa</Text>
            <Text style={styles.creditText}>Materia: Programación</Text>
            <Text style={styles.creditText}>Autotrónica</Text>
          </View>

          <View style={styles.bottomLogoContainer}>
            <View style={styles.bottomLogoCircle}>
              <Image
                source={require('../../assets/ImgSec.png')}
                style={styles.bottomLogo}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.yearText}>2026</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default WelcomeScreen;