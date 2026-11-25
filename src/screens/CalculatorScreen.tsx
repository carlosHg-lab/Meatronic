import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculatorStyles as styles } from '../theme/calculatorStyles';
import { COLORS } from '../theme/colors';
import { OhmTool } from '../calculator/tools/OhmTool';
import { FuseTool } from '../calculator/tools/FuseTool';
import { WireTool } from '../calculator/tools/WireTool';
import { PwmTool } from '../calculator/tools/PwmTool';
import { DisplacementTool } from '../calculator/tools/DisplacementTool';
import { CompressionTool } from '../calculator/tools/CompressionTool';
import { TireTool } from '../calculator/tools/TireTool';
import { ConverterTool } from '../calculator/tools/ConverterTool';

type ToolId =
  | 'ohm'
  | 'fuse'
  | 'wire'
  | 'pwm'
  | 'displacement'
  | 'compression'
  | 'tire'
  | 'converter';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type ToolDefinition = {
  id: ToolId;
  label: string;
  icon: IconName;
  Component: React.ComponentType;
};

const TOOLS: ToolDefinition[] = [
  { id: 'ohm', label: 'Ohm', icon: 'flash', Component: OhmTool },
  { id: 'fuse', label: 'Fusibles', icon: 'fuse', Component: FuseTool },
  { id: 'wire', label: 'Cable', icon: 'power-plug', Component: WireTool },
  { id: 'pwm', label: 'PWM', icon: 'waveform', Component: PwmTool },
  { id: 'displacement', label: 'Cilindrada', icon: 'engine', Component: DisplacementTool },
  { id: 'compression', label: 'Compresión', icon: 'gauge', Component: CompressionTool },
  { id: 'tire', label: 'Neumáticos', icon: 'tire', Component: TireTool },
  { id: 'converter', label: 'Conversor', icon: 'swap-horizontal', Component: ConverterTool },
];

export function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const [activeToolId, setActiveToolId] = useState<ToolId>('ohm');

  const activeTool =
    TOOLS.find((tool) => tool.id === activeToolId) ?? TOOLS[0];
  const ActiveTool = activeTool.Component;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 18 }]}>
        <Text style={styles.headerKicker}>HERRAMIENTAS OFFLINE</Text>
        <Text style={styles.headerTitle}>Calculadora de Taller</Text>
        <Text style={styles.headerSubtitle}>
          Cálculos eléctricos, de motor y conversiones sin conexión a internet.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.toolScroller}
        contentContainerStyle={styles.toolChips}
      >
        {TOOLS.map((tool) => {
          const active = tool.id === activeToolId;
          return (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolChip, active && styles.toolChipActive]}
              activeOpacity={0.8}
              onPress={() => setActiveToolId(tool.id)}
            >
              <MaterialCommunityIcons
                name={tool.icon}
                size={15}
                color={active ? COLORS.background : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.toolChipText,
                  active && styles.toolChipTextActive,
                ]}
              >
                {tool.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ActiveTool />
      </ScrollView>
    </View>
  );
}

export default CalculatorScreen;
