import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';
const SCHEDULED_NOTIFICATION_ID_KEY = '@scheduled_reminder_id';

export type NotificationSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  repeatDaily: boolean;
  soundEnabled: boolean;
  title?: string;
  body?: string;
};

export const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  hour: 8,
  minute: 0,
  repeatDaily: true,
  soundEnabled: true,
  title: 'Kieliharjoittelija',
  body: 'Muistithan tänään harjoitella ruotsia?',
};

export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Daily Reminders',
      description: 'Daily reminders to practice Swedish',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
    });
    console.log('✅ Android notification channel created');
  }
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number,
  options?: {
    repeats?: boolean;
    sound?: boolean;
    title?: string;
    body?: string;
  }
) {

  await setupNotificationChannel();

  await cancelAllNotifications();

  const { repeats = true, sound = true, title = 'Kieliharjoittelija', body = 'Muistithan tänään harjoitella ruotsia?' } = options || {};

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: sound ? 'default' : undefined,
      data: { type: 'daily_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: Platform.OS === 'android' ? 'daily-reminder' : undefined,
    } as Notifications.DailyTriggerInput,
  });


  await AsyncStorage.setItem(SCHEDULED_NOTIFICATION_ID_KEY, identifier);
  
  console.log(`✅ Daily reminder scheduled for ${hour}:${minute}`);
  return identifier;
}


export async function sendLocalTestNotification(options?: {
  title?: string;
  body?: string;
  sound?: boolean;
}) {
  const { title = 'Testi-ilmoitus 🧪', body = 'Tämä on paikallinen testi-ilmoitus!', sound = true } = options || {};

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: sound ? 'default' : undefined,
      data: { type: 'test_notification' },
    },
    trigger: null,
  });
}


export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    
    if (settings.enabled) {
      await scheduleDailyReminder(settings.hour, settings.minute, {
        repeats: settings.repeatDaily,
        sound: settings.soundEnabled,
        title: settings.title,
        body: settings.body,
      });
    } else {
      await cancelAllNotifications();
    }
  } catch (error) {
    console.error('Error saving notification settings:', error);
    throw error;
  }
}

export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading notification settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export async function sendPushNotification(
  expoPushToken: string,
  options?: {
    title?: string;
    body?: string;
    sound?: boolean;
    data?: Record<string, any>;
  }
) {
  const { title = 'Push-testi 🚀', body = 'Tämä on push-ilmoitus!', sound = true, data = {} } = options || {};

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: sound ? 'default' : undefined,
        title,
        body,
        data,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem(SCHEDULED_NOTIFICATION_ID_KEY);
}

export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

export async function checkNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}