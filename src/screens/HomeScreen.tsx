import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabsParamList } from '../navigation/BottomTabs';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createHomeStyles } from '../theme/homeStyles';

type NavigationProp = BottomTabNavigationProp<BottomTabsParamList, 'Inicio'>;

type Card = {
  label: string;
  screen: keyof BottomTabsParamList;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const CARDS: Card[] = [
  { label: 'Manuales', screen: 'Manuales', icon: 'book-open-page-variant' },
  { label: 'Diagramas', screen: 'Diagramas', icon: 'sitemap' },
  { label: 'Diccionario', screen: 'Diccionario', icon: 'book-alphabet' },
  { label: 'Calculadora', screen: 'Calculadora', icon: 'calculator-variant' },
];

const TOP_IMAGE: ImageSourcePropType = require('../../assets/Imagen1.jpg');

const SLIDER_IMAGES: ImageSourcePropType[] = [
  require('../../assets/Img1.jpg'),
  require('../../assets/Img2.jpg'),
  require('../../assets/Img3.jpg'),
  require('../../assets/Img4.jpg'),
  require('../../assets/Img5.jpg'),
  require('../../assets/Img6.jpg'),
  require('../../assets/Img7.jpg'),
  require('../../assets/Img8.jpg'),
  require('../../assets/Img9.jpg'),
  require('../../assets/Img10.jpg'),
];

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createHomeStyles);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % SLIDER_IMAGES.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Cabecera superior */}
      <View style={styles.topRow}>
        <View style={styles.kickerBadge}>
          <View style={styles.kickerDot} />
          <Text style={styles.topKicker}>Panel técnico</Text>
        </View>
        <ThemeToggle />
      </View>

      {/* Banner superior */}
      <View style={styles.topImageContainer}>
        <Image
          source={TOP_IMAGE}
          style={styles.topImage}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.header}>
        Manuales, diagramas, diccionario y cálculos
      </Text>

      {/* 4 Botones centrales con borde azul */}
      <View style={styles.grid}>
        {CARDS.map((card) => (
          <TouchableOpacity
            key={card.label}
            style={styles.card}
            activeOpacity={0.78}
            onPress={() => navigation.navigate(card.screen)}
          >
            <View style={styles.cardIconBadge}>
              <MaterialCommunityIcons
                name={card.icon}
                size={26}
                color={colors.accent}
              />
            </View>
            <Text style={styles.cardLabel}>{card.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Título intermedio: Novedades y Eventos */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionAccentBar} />
        <Text style={styles.sectionTitle}>Novedades y Eventos</Text>
      </View>

      {/* Carrusel ocupando todo el espacio inferior restante */}
      <View style={styles.carouselSection}>
        <View style={styles.carouselContainer}>
          <Image
            source={SLIDER_IMAGES[activeSlide]}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          {/* Indicadores superpuestos abajo para no robar espacio */}
          <View style={styles.dotsOverlay}>
            {SLIDER_IMAGES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeSlide && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;