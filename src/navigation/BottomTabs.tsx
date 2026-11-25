import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import DictionaryScreen from '../screens/DictionaryScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';
import { COLORS } from '../theme/colors';
import { bottomTabsStyles as styles } from '../theme/bottomTabsStyles';

export type BottomTabsParamList = {
  Inicio: undefined;
  Manuales: undefined;
  Diagramas: undefined;
  Diccionario: undefined;
  Perfil: undefined;
  Calculadora: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const TAB_ICONS: Record<
  keyof BottomTabsParamList,
  { focused: IconName; unfocused: IconName }
> = {
  Inicio: { focused: 'home', unfocused: 'home-outline' },
  Manuales: {
    focused: 'book-open-page-variant',
    unfocused: 'book-open-page-variant-outline',
  },
  Diagramas: { focused: 'image', unfocused: 'image-outline' },
  Diccionario: { focused: 'book-alphabet', unfocused: 'book-open-outline' },
  Perfil: { focused: 'account', unfocused: 'account-outline' },
  Calculadora: {
    focused: 'calculator',
    unfocused: 'calculator-variant-outline',
  },
};

function PlaceholderScreen({ label }: { label: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{label}</Text>
    </View>
  );
}

function DiagramasScreen() {
  return <PlaceholderScreen label="Diagramas" />;
}

function PerfilScreen() {
  return <PlaceholderScreen label="Perfil" />;
}

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ color, size, focused }) => {
          const icons =
            TAB_ICONS[route.name as keyof BottomTabsParamList];
          return (
            <MaterialCommunityIcons
              name={focused ? icons.focused : icons.unfocused}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Manuales" component={PdfViewerScreen} />
      <Tab.Screen name="Diagramas" component={DiagramasScreen} />
      <Tab.Screen name="Calculadora" component={CalculatorScreen} />
      <Tab.Screen name="Diccionario" component={DictionaryScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabs;
