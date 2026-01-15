import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { loginWithEmail } from '../services/firebaseService';

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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kirjaudu sisään</Text>
        <Text style={styles.subtitle}>Kirjaudu sisään, luo tili tai käytä vierastilaa!</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Syötä sähköposti"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Syötä salasana"
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
          {loading ? 'Käsitellään...' : 'Vieraskäyttäjä ilman Firebasea (ei toimi)'}
        </Text>
      </View>
    </View>
  );
};

//värit kopsattu facebookista ja googlelta
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  error: {
    color: 'red',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'white',
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
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default LoginScreen;