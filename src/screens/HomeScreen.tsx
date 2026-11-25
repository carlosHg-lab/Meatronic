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
import type { BottomTabsParamList } from '../navigation/BottomTabs';
import { homeStyles as styles } from '../theme/homeStyles';
import { COLORS } from '../theme/colors';

type NavigationProp = BottomTabNavigationProp<BottomTabsParamList, 'Inicio'>;

type Card = {
  label: string;
  screen: keyof BottomTabsParamList;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const CARDS: Card[] = [
  { label: 'Manuales', screen: 'Manuales', icon: 'book-open-page-variant' },
  { label: 'Diagramas', screen: 'Diagramas', icon: 'image' },
  { label: 'Diccionario', screen: 'Diccionario', icon: 'book-alphabet' },
  { label: 'Calculadora', screen: 'Calculadora', icon: 'calculator' },
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
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % SLIDER_IMAGES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image
          source={TOP_IMAGE}
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.header}>
        MANUALES, DIAGRAMAS, DICCIONARIO Y CÁLCULOS
      </Text>

      <View style={styles.grid}>
        {CARDS.map((card) => (
          <TouchableOpacity
            key={card.label}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(card.screen)}
          >
            <MaterialCommunityIcons
              name={card.icon}
              size={38}
              color={COLORS.primary}
            />
            <Text style={styles.cardLabel}>{card.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.carouselSection}>
        <View style={styles.carouselContainer}>
          <Image
            source={SLIDER_IMAGES[activeSlide]}
            style={styles.carouselImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.dotsContainer}>
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
  );
}

export default HomeScreen;
