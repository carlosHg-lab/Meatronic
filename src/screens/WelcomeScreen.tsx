import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { COLORS } from '../theme/colors';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          Tu Plataforma de Información Técnica Automotriz
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.credits}>
          <Text style={styles.creditText}>Desarrollador: Ismael Huanaco Carpio</Text>
          <Text style={styles.creditText}>Docente: Marco Paredes</Text>
          <Text style={styles.creditText}>2026</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.buttonText}>INGRESAR</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 32,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  credits: {
    alignItems: 'center',
    gap: 6,
  },
  creditText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
