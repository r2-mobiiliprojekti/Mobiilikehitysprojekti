import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainScreen from './MainScreen';
import { useTheme } from '../Contexts/ThemeContext';

type ProfileScreenProps = {
  user: {
    email: string;
    isGuest: boolean;
    uid: string;
  };
  onLogout: () => void;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);

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

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
  },
});

export default ProfileScreen;