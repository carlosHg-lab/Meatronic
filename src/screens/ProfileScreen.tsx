import React from 'react';
import { Text, View } from 'react-native';
import { profileStyles as styles } from '../theme/profileStyles';

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
    </View>
  );
}

export default ProfileScreen;
