import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../types/navigation'

export type Props = NativeStackScreenProps<MainAppStackParamList, 'FinSwe'>

export default function FinSwe(_: Props) {
  return (
    <View style={styles.container}>
      <Text>Haetaan sana suomeksi .xml tiedostosta, näytetään sen. Käyttäjä kirjoittaa sanan input kenttään ruotsiksi. vertaillaan tuloksia ja kerrotaan onko se oikein</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
})