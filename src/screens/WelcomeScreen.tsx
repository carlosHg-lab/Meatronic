import React from 'react';
import { Image, Pressable, StatusBar, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // O 'react-native-linear-gradient'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { welcomeStyles as styles } from '../theme/welcomeStyles';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <LinearGradient
      colors={['#07254C', '#04152D', '#020B18']}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Sección Superior: Logo Principal con Brillo y Título */}
      <View style={styles.topSection}>
        <View style={styles.logoWrapper}>
          {/* Capas de resplandor (Glow) */}
          <View style={styles.glowOuter} />
          <View style={styles.glowMid} />
          <View style={styles.glowInner} />

          <Image
            source={require('../../assets/screen.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Tu Plataforma de Información{'\n'}Técnica Automotriz
        </Text>
      </View>

      {/* Sección Inferior: Créditos y Logo Institucional */}
      <View style={styles.footer}>
        <View style={styles.credits}>
          <Text style={styles.creditText}>Desarrollador: Ismael Huanaco Carpio</Text>
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
              source={require('../../assets/ImagenLogo.jpeg')}
              style={styles.bottomLogo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.yearText}>2026</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

export default WelcomeScreen;