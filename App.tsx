// App.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainScreen from './screens/MainScreen';
import { 
  getCurrentUser, 
  onAuthStateChange,
  setGuestMode,
  AppUser 
} from './services/firebaseService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'main' | 'loading'>('loading');
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      
      if (user) {
        setCurrentScreen('main');
      } else {
        setCurrentScreen('login');
      }
    });

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('main');
    } else {
      setCurrentScreen('login');
    }

    return unsubscribe;
  }, []);

  const handleGuestLogin = () => {
    setGuestMode();
  };

  const handleLoginSuccess = () => {
    // Handled by auth listener
  };

  const handleSignupSuccess = () => {
    // Handled by auth listener
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const goToSignup = () => {
    setCurrentScreen('signup');
  };

  const goToLogin = () => {
    setCurrentScreen('login');
  };

  const goToSignupFromMain = () => {
    setCurrentScreen('signup');
  };

  if (currentScreen === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onGuestLogin={handleGuestLogin}
        onGoToSignup={goToSignup}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignupScreen
        onSignupSuccess={handleSignupSuccess}
        onGoToLogin={goToLogin}
      />
    );
  }

  if (currentScreen === 'main' && currentUser) {
    return (
      <MainScreen
        user={currentUser}
        onLogout={handleLogout}
        onGoToSignup={goToSignupFromMain}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Error. Restart app.</Text>
    </View>
  );
}