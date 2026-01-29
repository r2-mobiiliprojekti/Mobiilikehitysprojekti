import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import { getRandomSwedishWord, getRandomFinnishTranslation, isCorrectSwedish } from '../Services/sanastoService'
import type { Sanasto } from '../Types/sanasto'

export type Props = NativeStackScreenProps<MainAppStackParamList, 'SweFin'>

export default function FinSwe({ navigation }: Props) {
  const [entry, setEntry] = useState<Sanasto>(() => getRandomSwedishWord())
  const [finWord, setfinWord] = useState<string>(() =>
     getRandomFinnishTranslation(entry))
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)

  const accepted = entry.swedish

  function checkAnswer() {
    if (!answer.trim()) return
    setResult(isCorrectSwedish(entry, answer))
  }

  function nextWord() {
    const next = getRandomSwedishWord()
    setEntry(next)
    setfinWord(getRandomFinnishTranslation(next))
    setAnswer('')
    setResult(null)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Käännä ruotsiksi</Text>

      <View style={styles.card}>
        <Text style={styles.word}>{finWord}</Text>

        {!!entry.type && <Text style={styles.meta}>{entry.type}</Text>}

        <TextInput
          value={answer}
          onChangeText={(t) => {
            setAnswer(t)
            setResult(null)
          }}
          placeholder="Kirjoita ruotsiksi..."
          autoCapitalize="none"
          style={styles.input}
        />

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={checkAnswer}>
            <Text>Tarkista</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={nextWord}>
            <Text>Seuraava</Text>
          </Pressable>
        </View>

        {result !== null && (
          <Text style={styles.result}>
            {result ? 'Oikein!' : `Väärin. Hyväksytty: ${accepted}`}
          </Text>
        )}

        {entry.examples?.sv?.[0] && entry.examples?.fi?.[0] && (
          <View style={{ marginTop: 10 }}>
            <Text>Sanan käyttö lauseessa</Text>
            <Text>Ruotsiksi: {entry.examples.sv[0]}</Text>
            <Text>Suomeksi: {entry.examples.fi[0]}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    borderWidth: 8,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 32,
    gap: 12,
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
  },
  meta: {
    textAlign: 'center',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  result: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
})
