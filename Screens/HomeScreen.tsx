import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import { useTheme } from '../Contexts/ThemeContext'

type Props = NativeStackScreenProps<MainAppStackParamList, 'Home'>

export default function HomeScreen({ navigation }: Props) {
  const { isDark } = useTheme()
  
  const styles = createStyles(isDark)

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('FinSwe')} style={styles.button}>
        <Text style={styles.buttonText}>Käännä sanoja Suomeksi</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SweFin')} style={styles.button}>
        <Text style={styles.buttonText}>Käännä sanoja Ruotsiksi</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ConnectWords')} style={styles.button}>
        <Text style={styles.buttonText}>Yhdistä sanoja</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('PickWord')} style={styles.button}>
        <Text style={styles.buttonText}>Valitse oikea sana neljästä</Text>
      </Pressable>

      <Pressable 
        onPress={() => navigation.navigate('Profile')} 
        style={[styles.button, styles.profileButton]}
      >
        <Text style={styles.buttonText}>Profiili</Text>
      </Pressable>
    </View>
  )
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#121212' : '#ffe600',
    gap: 16,
    padding: 20,
  },
  button: {
    width: '100%',
    maxWidth: 300,
    height: 80,
    backgroundColor: isDark ? '#333' : '#1612ee',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButton: {
    backgroundColor: isDark ? '#4CAF50' : '#4CAF50',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
})