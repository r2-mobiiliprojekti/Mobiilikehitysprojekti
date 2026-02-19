import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import { getRandomSwedishWord, isCorrectFinnish } from '../Services/sanastoService'
import type { Sanasto } from '../Types/sanasto'
import { getWord } from '../api/Freedict/fetcher'
import { DbContext } from '../Services/databaseService'
import { saveWrongWord } from '../Services/wrongWordService'
import { saveCorrectWord } from '../Services/correctWordService'
import { updateStreak } from '../Services/streakService'
import { useTheme } from '../Contexts/ThemeContext'

export type Props = NativeStackScreenProps<MainAppStackParamList, 'FinSwe'>

export default function FinSwe({ navigation }: Props) {
  const { isDark } = useTheme()
  const [entry, setEntry] = useState<Sanasto>(getRandomSwedishWord())
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const accepted = entry.translations.join(', ')
  const [words, setWords] = useState<string[]>([])
  const db = useContext(DbContext)
  
  const styles = createStyles(isDark)

  useEffect(() => {
    console.log("FinSwe db:", db ? "READY" : "NULL")
  }, [db])

  // API
  useEffect(() => {
    const fetchFreedict = async () => {
      try {
        const data = await getWord('sv', entry.swedish)
        const words = [
          data.word,
          ...data.entries.flatMap(entry =>
            entry.forms?.filter(form =>
              !form.tags?.some(tag => tag === "table-tags" || tag === "inflection-template" || tag === "sv-adj-reg")
            ).map(form => form.word) || []
          )
        ]
        console.log(words)
        setWords(words)
      } catch (err) {
        console.log(err)
      } finally {
        //setLoading(false);
      } 
    }
    fetchFreedict()
  }, [entry])
  // API LOPPU

  async function checkAnswer() {
    if (!answer.trim()) return

    const ok = isCorrectFinnish(entry, answer)
    setResult(ok)

    if (!db) {
      console.log('Database not initialized')
      return
    }

    if (ok) {
      await saveCorrectWord(db, entry.swedish)
      console.log('Correct answer saved to database')
    } else {
      await saveWrongWord(db, entry.swedish)
      console.log('Wrong word saved to database')
    }

    const rows = await db.getAllAsync(`SELECT COUNT(*) as c FROM wrong_words;`)
    console.log("Wrong words count:", rows)

    const rows2 = await db.getAllAsync(`SELECT COUNT(*) as c FROM correct_words;`)
    console.log("Correct answers count;", rows2)

    await updateStreak(db, ok)
    console.log("Streak updated:", ok ? "correct" : "wrong")
    const s = await db.getFirstAsync("SELECT * FROM user_stats WHERE id = 1")
    console.log("user_stats row now:", s)
  }

  function nextWord() {
    setEntry(getRandomSwedishWord())
    setAnswer('')
    setResult(null)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Käännä suomeksi</Text>

      <View style={styles.card}>
        <Text style={styles.word}>{entry.swedish}</Text>

        {!!entry.type && <Text style={styles.meta}>{entry.type}</Text>}

        <TextInput
          value={answer}
          onChangeText={(t) => {
            setAnswer(t)
            setResult(null)
          }}
          placeholder="Kirjoita suomeksi..."
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
            {result
              ? ' Oikein!'
              : ` Väärin. Hyväksytyt: ${accepted}`}
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
      {words.length > 1 && (
        <Text style={styles.meta}>Taivutusmuodot: {words.join(', ')}</Text>
      )}
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