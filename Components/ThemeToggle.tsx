import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../Contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={[styles.container, isDark ? styles.dark : styles.light]}>
      <View style={[styles.toggleCircle, isDark ? styles.toggleCircleDark : styles.toggleCircleLight]}>
        <Text style={[styles.icon, isDark ? styles.iconDark : styles.iconLight]}>
          {isDark ? 'D' : 'L'}
        </Text>
      </View>
      <Text style={[styles.text, isDark ? styles.textDark : styles.textLight]}>
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  light: {
    backgroundColor: 'white',
    borderColor: '#ddd',
  },
  dark: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  toggleCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleCircleLight: {
    backgroundColor: '#b1b0a8',
  },
  toggleCircleDark: {
    backgroundColor: '#4A4A4A',
  },
  icon: {
    fontSize: 20,
  },
  iconLight: {
    color: '#333',
  },
  iconDark: {
    color: '#FFF',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textLight: {
    color: '#333',
  },
  textDark: {
    color: '#FFF',
  },
});

export default ThemeToggle;