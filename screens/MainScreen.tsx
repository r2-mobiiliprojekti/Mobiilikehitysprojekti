import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { logout } from '../services/firebaseService';

type MainScreenProps = {
  user: {
    email: string;
    isGuest: boolean;
    uid: string;
  };
  onLogout: () => void;
  onGoToSignup: () => void;
};

const MainScreen: React.FC<MainScreenProps> = ({ user, onLogout, onGoToSignup }) => {
  const handleLogout = async () => {
    try {
      if (!user.isGuest) {
        await logout();
      }
    } catch (error) {
      console.error('Virhe kirjautuessa:', error);
    } finally {
      onLogout();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Hello, {user.email}!
      </Text>


      {/*testin kortti firebase testiä varten*/}
      <Text style={styles.userType}>
        {user.isGuest ? 'Vierailija' : 'Rekisteröitynyt'}
      </Text>
      

      {!user.isGuest && (
        <View style={styles.userInfo}>
          <Text style={styles.userId}>User ID: {user.uid}</Text>
          <Text style={styles.firebaseNote}>Authenticated with Firebase</Text>
        </View>
      )}
      
      {user.isGuest && (
        <TouchableOpacity style={styles.upgradeButton} onPress={onGoToSignup}>
          <Text style={styles.upgradeButtonText}>Create Account</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>
          {user.isGuest ? 'Takaisin kirjautumiseen' : 'Kirjaudu ulos'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  userType: {
    fontSize: 20,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userId: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 10,
    textAlign: 'center',
  },
  firebaseNote: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 20,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainScreen;