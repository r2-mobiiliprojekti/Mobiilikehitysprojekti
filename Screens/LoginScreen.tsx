import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { loginWithEmail } from '../Services/firebaseService';
import { useTheme } from '../Contexts/ThemeContext';
import ThemeToggle from '../Components/ThemeToggle';

type LoginScreenProps = {
  onLoginSuccess: () => void;
  onGuestLogin: () => void;
  onGoToSignup: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLoginSuccess, 
  onGuestLogin, 
  onGoToSignup 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Syötä sähköposti ja salasana');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginWithEmail(email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Kirjautuminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Theme Toggle at the top right */}
        <View style={styles.themeToggleContainer}>
          <ThemeToggle />
        </View>
        
        <Text style={styles.title}>Kirjaudu sisään</Text>
        <Text style={styles.subtitle}>Kirjaudu sisään, luo tili tai käytä vierastilaa!</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Syötä sähköposti"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Syötä salasana"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Kirjaudu sisään</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.signupButton, loading && styles.disabledButton]} 
          onPress={onGoToSignup}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>Luo tili</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.guestButton, loading && styles.disabledButton]} 
          onPress={onGuestLogin}
          disabled={loading}
        >
          <Text style={styles.guestButtonText}>Jatka vierastilinä</Text>
        </TouchableOpacity>
        
        <Text style={styles.note}>
          {loading ? 'Käsitellään...' : 'Mobiiliprojekti @2026'}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
    paddingTop: 50,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#BBBBBB' : '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  error: {
    color: '#FF6B6B',
    backgroundColor: isDark ? '#2A2A2A' : '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: isDark ? '#2A2A2A' : 'white',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: isDark ? '#FFFFFF' : '#333',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: isDark ? '#555' : '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: isDark ? '#2A2A2A' : 'white',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  signupButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  guestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    color: isDark ? '#888' : '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default LoginScreen;