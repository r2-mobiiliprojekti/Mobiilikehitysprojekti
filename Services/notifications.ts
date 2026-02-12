import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// Set notification handler globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;

  // 1. Check if running on physical device
  if (!Device.isDevice) {
    Alert.alert('Physical Device Required', 'Push notifications only work on physical devices, not simulators.');
    return undefined;
  }

  // 2. Android: Create notification channel FIRST (required for SDK 53+)
  if (Platform.OS === 'android') {
    await createAndroidNotificationChannel();
  }

  // 3. Check and request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission Required', 'Failed to get push token for push notifications!');
    return undefined;
  }

  // 4. Get Expo Push Token - CRITICAL PART
  try {
    // Get projectId from app.json extra.eas.projectId
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    
    if (!projectId) {
      console.error('❌ No projectId found in app.json! Run "eas init" first.');
      Alert.alert(
        'Configuration Error',
        'Project ID is missing. Please run "npx eas init" in your terminal.'
      );
      return undefined;
    }

    console.log('✅ Found projectId:', projectId);

    token = (await Notifications.getExpoPushTokenAsync({
      projectId,
    })).data;

    console.log('✅ Expo Push Token generated:', token);
    return token;

  } catch (error) {
    console.error('❌ Error getting Expo push token:', error);
    Alert.alert(
      'Push Token Error',
      `Failed to get push token: ${error.message || 'Unknown error'}`
    );
    return undefined;
  }
}

// Android: Create notification channel (REQUIRED for SDK 53+)
export async function createAndroidNotificationChannel() {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        description: 'Default notification channel',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        bypassDnd: true,
      });
      
      // Also create daily reminder channel
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Daily Reminders',
        description: 'Daily reminders to practice Swedish',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
      });
      
      console.log('✅ Android notification channels created');
    } catch (error) {
      console.error('❌ Error creating notification channel:', error);
    }
  }
}

// Helper to check if push notifications are available
export async function isPushNotificationAvailable(): Promise<boolean> {
  if (!Device.isDevice) return false;
  
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}