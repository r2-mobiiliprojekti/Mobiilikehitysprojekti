import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import { getRandomSwedishWord, getRandomFinnishTranslation, isCorrectSwedish } from '../Services/sanastoService'
import type { Sanasto } from '../Types/sanasto'
import { getWord } from '../api/Freedict/fetcher'
import { useTheme } from '../Contexts/ThemeContext'

export type Props = NativeStackScreenProps<MainAppStackParamList, 'SweFin'>

export default function SweFin({ navigation }: Props) {
  const { isDark } = useTheme()
  const [entry, setEntry] = useState<Sanasto>(() => getRandomSwedishWord())
  const [finWord, setfinWord] = useState<string>(() =>
    getRandomFinnishTranslation(entry))
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const [words, setWords] = useState<string[]>([])

  const accepted = entry.swedish
  const styles = createStyles(isDark)

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

  // API
  useEffect(() => {
    const fetchFreedict = async () => {
      try {
        const data = await getWord('fi', finWord)
        const words = [
          data.word,
          ...data.entries.flatMap(entry =>
            entry.forms?.filter(form =>
              !form.tags?.some(tag => tag === "table-tags" || tag === "inflection-template" || tag === "fi-adj-reg")
            ).map(form => form.word) || []
          )
        ]
        const lisasanojapois = "gradation"
        
        const lisafiltteri = words.filter(item =>
          !/\d/.test(item) && !item.toLowerCase().includes(lisasanojapois.toLowerCase())
        )
        const uniquewords = Array.from(new Set(lisafiltteri))
        console.log(uniquewords)
        setWords(uniquewords.slice(0, 5))
      } catch (err) {
        console.log(err)
      } finally {
        //setLoading(false)
      }
    }
    fetchFreedict()
  }, [entry])
  // API LOPPU

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
          placeholderTextColor={isDark ? '#888' : '#999'}
          autoCapitalize="none"
          style={styles.input}
        />

        <View style={styles.row}>
          <Pressable 
            style={({pressed}) => [
              styles.btn,
              pressed && { opacity: 0.7 }
            ]} 
            onPress={checkAnswer}
          >
            <Text style={styles.btnText}>Tarkista</Text>
          </Pressable>

          <Pressable 
            style={({pressed}) => [
              styles.btn,
              pressed && { opacity: 0.7 }
            ]} 
            onPress={nextWord}
          >
            <Text style={styles.btnText}>Seuraava</Text>
          </Pressable>
        </View>

        {result !== null && (
          <Text style={[styles.result, result ? styles.correctText : styles.wrongText]}>
            {result ? 'Oikein!' : `Väärin. Hyväksytty: ${accepted}`}
          </Text>
        )}

        {entry.examples?.sv?.[0] && entry.examples?.fi?.[0] && (
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Sanan käyttö lauseessa</Text>
            <Text style={styles.exampleText}>Ruotsiksi: {entry.examples.sv[0]}</Text>
            <Text style={styles.exampleText}>Suomeksi: {entry.examples.fi[0]}</Text>
          </View>
        )}
      </View>
      <Text style={styles.meta}>Taivutusmuotoja: {words.join(', ')}</Text>
    </View>
  )
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: isDark ? '#121212' : '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: isDark ? '#FFFFFF' : '#333',
  },
  card: {
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ddd',
    borderRadius: 14,
    padding: 32,
    gap: 12,
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    color: isDark ? '#FFFFFF' : '#333',
  },
  meta: {
    textAlign: 'center',
    color: isDark ? '#BBBBBB' : '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 6,
    backgroundColor: isDark ? '#2A2A2A' : '#fff',
    color: isDark ? '#FFFFFF' : '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: isDark ? '#666' : '#222',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: isDark ? '#333' : '#fff',
  },
  btnText: {
    color: isDark ? '#FFFFFF' : '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  result: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  correctText: {
    color: '#4CAF50',
  },
  wrongText: {
    color: '#F44336',
  },
  exampleContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: isDark ? '#2A2A2A' : '#f5f5f5',
    borderRadius: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#BBBBBB' : '#666',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: isDark ? '#FFFFFF' : '#333',
  },
})