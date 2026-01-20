import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import FinSwe from './screens/FinSwe';
import SweFin from './screens/SweFin';
import ConnectWords from './screens/ConnectWords';
import PickWord from './screens/PickWord';
import MainScreen from './screens/MainScreen';
import { 
  getCurrentUser, 
  onAuthStateChange,
  setGuestMode,
  getStoredUser,
  AppUser 
} from './services/firebaseService';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainAppStack = createNativeStackNavigator();

function AuthNavigator({ onGuestLogin }: { onGuestLogin: () => void }) {
  return (
    <AuthStack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <AuthStack.Screen name="Login">
        {(props) => (
          <LoginScreen
            onLoginSuccess={() => {}}
            onGuestLogin={onGuestLogin}
            onGoToSignup={() => props.navigation.navigate('Signup')}
          />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="Signup">
        {(props) => (
          <SignupScreen
            onSignupSuccess={() => {}}
            onGoToLogin={() => props.navigation.navigate('Login')}
          />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function MainAppNavigator() {
  return (
    <MainAppStack.Navigator initialRouteName="Home">
      <MainAppStack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Kieliharjoittelija',
          headerStyle: {
            backgroundColor: '#ffe600',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <MainAppStack.Screen 
        name="FinSwe" 
        component={FinSwe} 
        options={{ 
          title: 'Suomi → Ruotsi',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }} 
      />
      <MainAppStack.Screen 
        name="SweFin" 
        component={SweFin} 
        options={{ 
          title: 'Ruotsi → Suomi',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }} 
      />
      <MainAppStack.Screen 
        name="ConnectWords" 
        component={ConnectWords} 
        options={{ 
          title: 'Yhdistä sanat',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }} 
      />
      <MainAppStack.Screen 
        name="PickWord" 
        component={PickWord} 
        options={{ 
          title: 'Valitse oikea sana',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }} 
      />
    </MainAppStack.Navigator>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeApp = async () => {
      console.log('Starting app initialization...');
      
      try {
        //auth listeneri ENSIN!
        unsubscribe = onAuthStateChange((user) => {
          console.log('Auth state change callback:', user?.email || 'null');
          setCurrentUser(user);
          setIsLoading(false);
        });

        //hae listener
        const user = getCurrentUser();
        console.log('Initial getCurrentUser:', user?.email || 'null');
        
        if (user) {
          setCurrentUser(user);
          setIsLoading(false);
        } else {
          //wenaa sekka
          setTimeout(() => {
            if (!currentUser) {
              setIsLoading(false);
            }
          }, 1000);
        }
        
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleGuestLogin = async () => {
    try {
      console.log('Handling guest login...');
      const guestUser = await setGuestMode();
      console.log('Guest user created:', guestUser.email);
      setCurrentUser(guestUser);
    } catch (error) {
      console.error('Error in guest login:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    console.log('User logged out');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>Ladataan...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainApp">
            {() => <MainAppNavigator />}
          </RootStack.Screen>
          <RootStack.Screen name="Profile">
            {() => (
              <MainScreen
                user={currentUser}
                onLogout={handleLogout}
                onGoToSignup={() => {}}
              />
            )}
          </RootStack.Screen>
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Auth">
            {() => <AuthNavigator onGuestLogin={handleGuestLogin} />}
          </RootStack.Screen>
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
}