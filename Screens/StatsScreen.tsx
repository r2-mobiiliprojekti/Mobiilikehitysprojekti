import React, { useEffect, useState, useContext, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import PieChart from 'react-native-pie-chart'
import { BarChart } from 'react-native-chart-kit'
import { useFocusEffect } from '@react-navigation/native'
import { DbContext } from '../Services/databaseService'
import { getStats } from '../Services/statisticsService'
import { getUserStats } from '../Services/userStatsService'

export default function StatsScreen() {
  const db = useContext(DbContext)

  const [stats, setStats] = useState({ correct: 0, wrong: 0 })
  const [streak, setStreak] = useState({
    current_streak: 0,
    best_streak: 0,
    current_wrong_streak: 0,
    worst_wrong_streak: 0,
  })

  const load = useCallback(async () => {
    if (!db) return

    const result = await getStats(db)
    const streakData = await getUserStats(db)

    setStats(result)
    setStreak(streakData)
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

  const screenWidth = Dimensions.get('window').width

  const streakBarData = {
    labels: ['🤠', '🤓', '🤕', '🤯'],
    datasets: [
      {
        data: [
          streak.current_streak,
          streak.best_streak,
          streak.current_wrong_streak,
          streak.worst_wrong_streak,
        ],
      },
    ],
  }

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

          <View style={{ marginTop: 20 }}>
            <Text style={styles.text}>🤠 Nykyinen Putki: {streak.current_streak}</Text>
            <Text style={styles.text}>🤓 Paras putki: {streak.best_streak}</Text>
            <Text style={styles.text}>🤕 Häviöputki: {streak.current_wrong_streak}</Text>
            <Text style={styles.text}>🤯 Pahin häviöputki: {streak.worst_wrong_streak}</Text>
          </View>

          <BarChart
            data={streakBarData}
            width={screenWidth - 32}
            height={220}
            fromZero
            withInnerLines={false}
            showValuesOnTopOfBars
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              propsForBackgroundLines: { stroke: '#eee' },
            }}
            style={{ marginTop: 16, borderRadius: 12 }}
          />
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
