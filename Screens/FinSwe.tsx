import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import { getRandomWord, isCorrect } from '../Services/sanastoService'
import type { Sanasto } from '../Types/sanasto'
import { getWord } from '../api/Freedict/fetcher'


export type Props = NativeStackScreenProps<MainAppStackParamList, 'FinSwe'>

export default function FinSwe({ navigation }: Props) {
  const [entry, setEntry] = useState<Sanasto>(getRandomWord())
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  
  const accepted = entry.translations.join(', ')

  const [words, setWords] = useState<string[]>([]);


// API
useEffect(() => {
  const fetchFreedict = async () => {
    try {
      const data = await getWord('sv', entry.swedish);
      const words = [
        data.word,
        ...data.entries.flatMap(entry => 
          entry.forms?.filter(form => 
            !form.tags?.some(tag => tag === "table-tags" || tag === "inflection-template" || tag === "sv-adj-reg")
          ).map(form => form.word) || []
        )
      ]
      //.slice(0, 3);
      
      console.log(words);
      const uniqueWords = Array.from(new Set(words));
      setWords(uniqueWords);
      
      
      

    } catch (err) {
      console.log(err);
      //setError('Failed to fetch freedict data')
    } finally {
      //setLoading(false);
    }
  };

  

  fetchFreedict();
}, [entry]);
// API LOPPU

  


  function checkAnswer() {
    if (!answer.trim()) return
    setResult(isCorrect(entry, answer))
  }

  function nextWord() {
    setEntry(getRandomWord())
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
            {result
              ? ' Oikein!'
              : ` Väärin. Hyväksytyt: ${accepted}`}
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
      {/* API DATA DISPLAY */}
      {words.length > 1 && (
  <Text style={styles.meta}>Sanat: {words.join(', ')}</Text>
)}
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