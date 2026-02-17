import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import { useTheme } from '../Contexts/ThemeContext'

type Props = NativeStackScreenProps<MainAppStackParamList, 'Home'>

export default function HomeScreen({ navigation }: Props) {
  const { isDark } = useTheme()
  const styles = createStyles(isDark)

  const menuItems = [
    { 
      id: 1, 
      title: 'Käännä sanoja Suomeksi', 
      screen: 'FinSwe',
      icon: '🇫🇮',
      color: '#4A90E2'
    },
    { 
      id: 2, 
      title: 'Käännä sanoja Ruotsiksi', 
      screen: 'SweFin',
      icon: '🇸🇪',
      color: '#50C878'
    },
    { 
      id: 3, 
      title: 'Yhdistä sanoja', 
      screen: 'ConnectWords',
      icon: '🔗',
      color: '#F5A623'
    },
    { 
      id: 4, 
      title: 'Valitse oikea sana', 
      screen: 'PickWord',
      icon: '✅',
      color: '#9B59B6'
    },
    { 
      id: 5, 
      title: 'Tilastot', 
      screen: 'Stats',
      icon: '📊',
      color: '#FF6B6B'
    },
  ]

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.navigate('Profile')} 
          style={({pressed}) => [
            styles.profileButton,
            pressed && styles.profileButtonPressed
          ]}
        >
          <Text style={styles.profileButtonIcon}>👤</Text>
          <Text style={styles.profileButtonText}>Profiili</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Sanasto</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Tervetuloa!</Text>
        <Text style={styles.welcomeText}>Valitse harjoitusmuoto</Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => navigation.navigate(item.screen as any)}
            style={({pressed}) => [
              styles.menuCard,
              { backgroundColor: item.color + '20' },
              pressed && styles.menuCardPressed
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: isDark ? '#121212' : '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#4CAF50' : '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  profileButtonIcon: {
    fontSize: 18,
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#333',
  },
  placeholder: {
    width: 90, // Matches profile button width for balance
  },
  welcomeCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#333',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: isDark ? '#BBBBBB' : '#666',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 30,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: isDark ? '#FFFFFF' : '#333',
  },
})