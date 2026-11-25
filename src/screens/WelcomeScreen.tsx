import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { ThemeToggle } from '../components/ThemeToggle';
import { useThemedStyles } from '../theme/ThemeContext';
import { createWelcomeStyles } from '../theme/welcomeStyles';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const styles = useThemedStyles(createWelcomeStyles);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topRow}>
          <Text style={styles.topKicker}>Instrumento de diagnóstico</Text>
          <ThemeToggle />
        </View>

        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/ImagenPrincipal.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          Tu plataforma de información técnica automotriz
        </Text>
      </View>

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
              source={require('../../assets/ImagenLogo.jpeg')}
              style={styles.bottomLogo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.yearText}>2026</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default WelcomeScreen;
