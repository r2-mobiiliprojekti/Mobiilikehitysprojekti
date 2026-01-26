import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'

type Props = NativeStackScreenProps<MainAppStackParamList, 'ConnectWords'>

export default function ConnectWords(_: Props) {
  return (
    <View style={styles.container}>
      <Text>haetaan 10 sanapari käännöstä, käyttäjä sitten joutuu yhdistämään oikeat sanaparit.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})