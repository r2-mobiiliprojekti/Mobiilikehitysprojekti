import React, { useEffect, useState, useContext, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PieChart from 'react-native-pie-chart'
import { useFocusEffect } from '@react-navigation/native'
import { DbContext } from '../Services/databaseService'
import { getStats } from '../Services/statisticsService'

export default function StatsScreen() {
  const db = useContext(DbContext)
  const [stats, setStats] = useState({ correct: 0, wrong: 0 })

  const load = useCallback(async () => {
    if (!db) return
    const result = await getStats(db)
    setStats(result)
  }, [db])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  useEffect(() => {
    load()
  }, [load])

  const total = stats.correct + stats.wrong

  const series = [
    { value: stats.correct, color: '#4CAF50' },
    { value: stats.wrong, color: '#F44336' },
  ].filter(s => s.value > 0)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tilastot</Text>

      {total === 0 ? (
        <Text style={styles.noStats}>Ei vielä vastauksia</Text>
      ) : (
        <>
          <PieChart
            widthAndHeight={220}
            series={series}
            labels={(slice) => `${Math.round((slice.value / total) * 100)}%`}
            cover={{ radius: 0.55, color: '#fff' }}
          />

          <View style={{ marginTop: 16 }}>
            <Text style={styles.text}>
              Oikein: {stats.correct} ({Math.round((stats.correct / total) * 100)}%)
            </Text>
            <Text style={styles.text}>
              Väärin: {stats.wrong} ({Math.round((stats.wrong / total) * 100)}%)
            </Text>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginTop: 6,
    textAlign: 'center',
  },
  noStats: {
    color: '#666',
  },
})
