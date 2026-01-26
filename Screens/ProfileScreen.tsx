import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainScreen from './MainScreen';

type ProfileScreenProps = {
  user: {
    email: string;
    isGuest: boolean;
    uid: string;
  };
  onLogout: () => void;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  return (
    <View style={styles.container}>
      <MainScreen
        user={user}
        onLogout={onLogout}
        onGoToSignup={() => {}} // Not needed in profile
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ProfileScreen;