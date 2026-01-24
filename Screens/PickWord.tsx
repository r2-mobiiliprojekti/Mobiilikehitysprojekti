import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'

type Props = NativeStackScreenProps<MainAppStackParamList, 'PickWord'>

export default function PickWord(_: Props) {
  return (
    <View style={styles.container}>
      <Text>Haetaan sana suomeksi/ruotsiksi, käyttäjä joutuu sen jälkeen valitsemaan oikean neljästä sanasta. Kerrotaan onko oikein.</Text>
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
