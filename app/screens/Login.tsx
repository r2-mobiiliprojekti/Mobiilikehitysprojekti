import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import  { Button as PaperButton } from 'react-native-paper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('User signed in:', response);
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('User signed up:', response);
    } catch (error) {
      console.log('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <View style={styles.container}>
        
        <TextInput
            style={styles.input}
            placeholder="Sähköposti"
            value={email}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
        />
        <TextInput
            style={styles.input}
            placeholder="Salasana"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
        />
        <PaperButton
            mode="contained"
            onPress={signIn}
            style={styles.button}
            loading={loading}
        >
            Kirjaudu sisään
        </PaperButton>
        <PaperButton
            mode="outlined"
            onPress={signUp}
            style={styles.button}
        >
            Rekisteröidy
        </PaperButton>
      {loading ? <Text>Lataa...</Text> : null}
        
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    
    padding: 20,
    
  },
  input: {
    
    borderWidth: 1,
    borderColor: '#111',
    
    marginBottom: 10,
    
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  }
  
   
    

  
});

export default Login;