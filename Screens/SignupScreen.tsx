import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { signupWithEmail } from '../Services/firebaseService';
import { useTheme } from '../Contexts/ThemeContext';

type SignupScreenProps = {
  onSignupSuccess: () => void;
  onGoToLogin: () => void;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignupSuccess, onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  const validateForm = () => {
    if (!email.trim() || !password || !confirmPassword) {
      return 'Täytä kaikki kentät';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Syötä toimiva sähköpostiosoite';
    }
    
    if (password !== confirmPassword) {
      return 'Salasanat eivät täsmää';
    }
    
    if (password.length < 6) {
      return 'Salasanan tulee olla vähintään 6 merkkiä';
    }
    
    return '';
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signupWithEmail(email.trim(), password);
      onSignupSuccess();
    } catch (err: any) {
      setError(err.message || 'Rekisteröityminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onGoToLogin} style={styles.backButton}>
          <Text style={styles.backButtonText}>Takaisin</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Tilin Luonti</Text>
        <Text style={styles.subtitle}>Luo tili</Text>
        
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
          placeholder="Syötä salasana (vähintään 6 merkkiä)"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Vahvista salasana"
          placeholderTextColor={isDark ? '#888' : '#666'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />
        
        <TouchableOpacity 
          style={[styles.signupButton, loading && styles.disabledButton]} 
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.signupButtonText}>Luo tili</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Oletko jo rekisteröitynyt? </Text>
          <TouchableOpacity onPress={onGoToLogin} disabled={loading}>
            <Text style={styles.loginLink}>Kirjaudu sisään</Text>
          </TouchableOpacity>
        </View>
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
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
  signupButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: isDark ? '#555' : '#ccc',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: isDark ? '#BBBBBB' : '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignupScreen;