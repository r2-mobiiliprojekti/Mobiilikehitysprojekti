import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'SweFin'>


export default function SweFin(_: Props) {
  return (
    <View style={styles.container}>
      <Text>Haetaan sana ruotsiksi .xml tiedostosta, näytetään sen. Käyttäjä kirjoittaa sanan input kenttään suomeksi. vertaillaan tuloksia ja kerrotaan onko se oikein</Text>
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
