import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HomeScreen } from '../screens/HomeScreen';
import { DictionaryScreen } from '../screens/DictionaryScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { ManualesScreen } from '../screens/ManualesScreen';
import { DiagramasScreen } from '../screens/DiagramasScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import { createBottomTabsStyles } from '../theme/bottomTabsStyles';
import type { BottomTabsParamList } from './types';

export type { BottomTabsParamList } from './types';

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

export function BottomTabs() {
  const { colors } = useTheme();
  const styles = useThemedStyles(createBottomTabsStyles);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ color, size, focused }) => {
          const icons = TAB_ICONS[route.name as keyof BottomTabsParamList];
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
      <Tab.Screen name="Manuales" component={ManualesScreen} />
      <Tab.Screen name="Diagramas" component={DiagramasScreen} />
      <Tab.Screen name="Calculadora" component={CalculatorScreen} />
      <Tab.Screen name="Diccionario" component={DictionaryScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabs;
