import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import FinSwe from './Screens/FinSwe';
import SweFin from './Screens/SweFin';
import ConnectWords from './Screens/ConnectWords';
import PickWord from './Screens/PickWord';
import MainScreen from './Screens/MainScreen';
import { RootStackParamList, AuthStackParamList, MainAppStackParamList } from './Types/navigation';

import { 
  getCurrentUser, 
  onAuthStateChange,
  setGuestMode,
  AppUser 
} from './Services/firebaseService';
import { ThemeProvider, useTheme } from './Contexts/ThemeContext';

const RootStack = createNativeStackNavigator<RootStackParamList>()
const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const MainAppStack = createNativeStackNavigator<MainAppStackParamList>()

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
  const { isDark } = useTheme();
  
  return (
    <MainAppStack.Navigator initialRouteName="Home">
      <MainAppStack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Kieliharjoittelija',
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#ffe600',
          },
          headerTintColor: isDark ? '#fff' : '#000',
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
            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }} 
      />
      <MainAppStack.Screen 
        name="SweFin" 
        component={SweFin} 
        options={{ 
          title: 'Ruotsi → Suomi',
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }} 
      />
      <MainAppStack.Screen 
        name="ConnectWords" 
        component={ConnectWords} 
        options={{ 
          title: 'Yhdistä sanat',
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }} 
      />
      <MainAppStack.Screen 
        name="PickWord" 
        component={PickWord} 
        options={{ 
          title: 'Valitse oikea sana',
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }} 
      />
    </MainAppStack.Navigator>
  );
}

// Loading Component
function LoadingScreen() {
  const { isDark } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: isDark ? '#121212' : '#f5f5f5' 
    }}>
      <ActivityIndicator size="large" color={isDark ? '#BB86FC' : '#2196F3'} />
      <Text style={{ 
        marginTop: 20, 
        fontSize: 16, 
        color: isDark ? '#E0E0E0' : '#666' 
      }}>
        Ladataan...
      </Text>
    </View>
  );
}

// Main App Component
function AppContent() {
  const { isDark } = useTheme();
  
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeApp = async () => {
      console.log('Starting app initialization...');
      
      try {
        unsubscribe = onAuthStateChange((user) => {
          console.log('Auth state change callback:', user?.email || 'null');
          setCurrentUser(user);
          setIsLoading(false);
        });

        const user = getCurrentUser();
        console.log('Initial getCurrentUser:', user?.email || 'null');
        
        if (user) {
          setCurrentUser(user);
          setIsLoading(false);
        } else {
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
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
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

// Main App wrapper
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}