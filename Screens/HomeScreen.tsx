import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../types/navigation'

type Props = NativeStackScreenProps<MainAppStackParamList, 'Home'>

export default function HomeScreen({ navigation }: Props) {
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

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffe600',
    gap: 16,
  },
  button: {
    width: 240,
    height: 80,
    backgroundColor: '#1612ee',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
