import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';

type Card = {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const CARDS: Card[] = [
  { label: 'Manuales', icon: 'book' },
  { label: 'Diagramas', icon: 'image' },
  { label: 'Diccionario', icon: 'book-open' },
  { label: 'Calculadora', icon: 'calculator' },
];

export function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>
        MANUALES, DIAGRAMAS, DICCIONARIO Y CÁLCULOS
      </Text>

      <View style={styles.grid}>
        {CARDS.map((card) => (
          <View key={card.label} style={styles.card}>
            <MaterialCommunityIcons
              name={card.icon}
              size={40}
              color={COLORS.primary}
            />
            <Text style={styles.cardLabel}>{card.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
  },
  header: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cardLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
