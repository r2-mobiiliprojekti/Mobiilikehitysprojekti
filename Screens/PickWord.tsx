import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import { useTheme } from '../Contexts/ThemeContext'

type Props = NativeStackScreenProps<MainAppStackParamList, 'PickWord'>

export default function PickWord(_: Props) {
  const { isDark } = useTheme()
  const styles = createStyles(isDark)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Haetaan sana suomeksi/ruotsiksi, käyttäjä joutuu sen jälkeen 
        valitsemaan oikean neljästä sanasta. Kerrotaan onko oikein.
      </Text>
    </View>
  )
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#121212' : '#fff',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: isDark ? '#FFFFFF' : '#333',
    lineHeight: 24,
  },
})