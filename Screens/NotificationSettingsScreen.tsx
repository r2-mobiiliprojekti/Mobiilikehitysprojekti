import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainAppStackParamList } from '../Types/navigation';
import { useTheme } from '../Contexts/ThemeContext';
import {
  NotificationSettings,
  DEFAULT_SETTINGS,
  loadNotificationSettings,
  saveNotificationSettings,
  sendLocalTestNotification,
  sendPushNotification,
  checkNotificationPermissions,
  requestNotificationPermissions,
  getAllScheduledNotifications,
  cancelAllNotifications,
} from '../Services/notificationHelpers';
import { registerForPushNotificationsAsync } from '../Services/notifications';

type Props = NativeStackScreenProps<MainAppStackParamList, 'NotificationSettings'>;

export default function NotificationSettingsScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);

  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    initializeNotificationSystem();
  }, []);


    const initializeNotificationSystem = async () => {
    setLoading(true);
    try {
        //permissions
        const permission = await checkNotificationPermissions();
        setHasPermission(permission);

        const savedSettings = await loadNotificationSettings();
        setSettings(savedSettings);

        //try to get push token
        const token = await registerForPushNotificationsAsync();
        if (token) {
        setExpoPushToken(token);
        console.log('✅ Push token set successfully');
        } else {
        console.log('⚠️ No push token received');
        }

        await refreshScheduledNotifications();
    } catch (error) {
        console.error('Error initializing notifications:', error);
    } finally {
        setLoading(false);
    }
    };

  const refreshScheduledNotifications = async () => {
    const scheduled = await getAllScheduledNotifications();
    setScheduledNotifications(scheduled);
  };

  const handleToggleEnabled = async (value: boolean) => {
    const newSettings = { ...settings, enabled: value };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);
    await refreshScheduledNotifications();
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newSettings = {
        ...settings,
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
        enabled: true,
      };
      setSettings(newSettings);
      await saveNotificationSettings(newSettings);
      await refreshScheduledNotifications();
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);
    
    if (key === 'enabled' || key === 'repeatDaily' || key === 'soundEnabled') {
      await refreshScheduledNotifications();
    }
  };

  const handleTestLocal = async () => {
    await sendLocalTestNotification({
      title: 'Testi-ilmoitus 🔔',
      body: 'Tämä on testi-ilmoitus! Asetukset toimivat.',
      sound: settings.soundEnabled,
    });
    Alert.alert('Onnistui', 'Testi-ilmoitus lähetetty!');
  };

  const handleTestPush = async () => {
    if (!expoPushToken) {
      Alert.alert('Virhe', 'Push-tokenia ei löydy. Yritä uudelleen.');
      return;
    }

    setLoading(true);
    try {
      await sendPushNotification(expoPushToken, {
        title: 'Push-testi 📱',
        body: 'Tämä on push-ilmoitus!',
        sound: settings.soundEnabled,
        data: { screen: 'Home', from: 'NotificationSettings' },
      });
      Alert.alert('Onnistui', 'Push-ilmoitus lähetetty!');
    } catch (error) {
      Alert.alert('Virhe', 'Push-ilmoituksen lähetys epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermissions();
    setHasPermission(granted);
    if (granted) {
      Alert.alert('Onnistui', 'Ilmoitusoikeudet myönnetty!');
      initializeNotificationSystem();
    }
  };

  const handleCancelAll = async () => {
    Alert.alert(
      'Peruuta kaikki ilmoitukset',
      'Haluatko varmasti peruuttaa kaikki aikataulutetut ilmoitukset?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Kyllä',
          style: 'destructive',
          onPress: async () => {
            await cancelAllNotifications();
            const newSettings = { ...settings, enabled: false };
            setSettings(newSettings);
            await saveNotificationSettings(newSettings);
            await refreshScheduledNotifications();
            Alert.alert('Onnistui', 'Kaikki ilmoitukset peruttu');
          },
        },
      ]
    );
  };

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  if (loading && !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={isDark ? '#BB86FC' : '#2196F3'} />
        <Text style={styles.loadingText}>Ladataan asetuksia...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Ilmoitusasetukset 🔔</Text>
        <Text style={styles.subtitle}>
          Hallitse päivittäisiä muistutuksia ja testaa ilmoituksia
        </Text>
      </View>

      {/* Permission Status */}
      {!hasPermission && (
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Ilmoitusoikeudet puuttuvat</Text>
          <Text style={styles.permissionText}>
            Salli ilmoitukset saadaksesi päivittäisiä muistutuksia
          </Text>
          <Pressable style={styles.permissionButton} onPress={handleRequestPermission}>
            <Text style={styles.permissionButtonText}>Salli ilmoitukset</Text>
          </Pressable>
        </View>
      )}

      {/* Main Settings Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Päivittäinen muistutus</Text>

        {/* Enable Switch */}
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Käytössä</Text>
            <Text style={styles.settingDescription}>
              Muistutus harjoittelusta joka päivä
            </Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={(value) => handleToggleEnabled(value)}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : settings.enabled ? '#fff' : '#f4f3f4'}
            disabled={!hasPermission}
          />
        </View>

        {/* Time Picker */}
        {settings.enabled && (
          <>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Aika</Text>
                <Text style={styles.settingDescription}>
                  {formatTime(settings.hour, settings.minute)}
                </Text>
              </View>
              <Pressable
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
                disabled={!hasPermission}
              >
                <Text style={styles.timeButtonText}>Vaihda</Text>
              </Pressable>
            </View>

            {/* Repeat Daily Switch */}
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Toista päivittäin</Text>
                <Text style={styles.settingDescription}>
                  Muistutus joka päivä samaan aikaan
                </Text>
              </View>
              <Switch
                value={settings.repeatDaily}
                onValueChange={(value) => handleSettingChange('repeatDaily', value)}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
              />
            </View>

            {/* Sound Switch */}
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Ääni</Text>
                <Text style={styles.settingDescription}>
                  Toista ääni ilmoituksen yhteydessä
                </Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => handleSettingChange('soundEnabled', value)}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
              />
            </View>
          </>
        )}
      </View>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date(new Date().setHours(settings.hour, settings.minute))}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Test Notifications Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Testi-ilmoitukset</Text>

        <Pressable style={styles.testButton} onPress={handleTestLocal}>
          <Text style={styles.testButtonText}>📱 Lähetä testi-ilmoitus</Text>
          <Text style={styles.testButtonDescription}>
            Välitön paikallinen testi
          </Text>
        </Pressable>

        <Pressable
          style={[styles.testButton, expoPushToken ? {} : styles.testButtonDisabled]}
          onPress={handleTestPush}
          disabled={!expoPushToken}
        >
          <Text style={styles.testButtonText}>🚀 Lähetä push-testi</Text>
          <Text style={styles.testButtonDescription}>
            {expoPushToken ? 'Testaa push-ilmoitus' : 'Push-token puuttuu'}
          </Text>
        </Pressable>
      </View>

      {/* Current Schedule Card */}
      {scheduledNotifications.length > 0 && (
        <View style={styles.card}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.cardTitle}>Aikataulutetut ilmoitukset</Text>
            <Text style={styles.scheduleCount}>{scheduledNotifications.length}</Text>
          </View>
          {scheduledNotifications.map((notification, index) => {
            const trigger = notification.trigger;
            const isDaily = trigger?.hour !== undefined && trigger?.minute !== undefined;
            
            return (
              <View key={notification.identifier} style={styles.scheduleItem}>
                <View style={styles.scheduleIcon}>
                  <Text>🔔</Text>
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTitle}>
                    {isDaily
                      ? `Päivittäin klo ${trigger.hour.toString().padStart(2, '0')}:${trigger.minute.toString().padStart(2, '0')}`
                      : 'Kertaluontoinen'}
                  </Text>
                  <Text style={styles.scheduleSubtitle}>
                    {notification.content.title}
                  </Text>
                </View>
              </View>
            );
          })}

          <Pressable style={styles.cancelButton} onPress={handleCancelAll}>
            <Text style={styles.cancelButtonText}>Peruuta kaikki ilmoitukset</Text>
          </Pressable>
        </View>
      )}

      {/* Push Token Info (Hidden but available for debugging) */}
      {__DEV__ && expoPushToken && (
        <View style={[styles.card, styles.debugCard]}>
          <Text style={styles.debugTitle}>Debug Info</Text>
          <Text style={styles.debugText} numberOfLines={2} ellipsizeMode="middle">
            Push Token: {expoPushToken}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#f5f5f5',
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#121212' : '#f5f5f5',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: isDark ? '#E0E0E0' : '#666',
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#333',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#BBBBBB' : '#666',
    },
    permissionCard: {
      backgroundColor: isDark ? '#2A2A2A' : 'white',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#FFB74D',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    permissionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFB74D' : '#FF9800',
      marginBottom: 8,
    },
    permissionText: {
      fontSize: 14,
      color: isDark ? '#BBBBBB' : '#666',
      marginBottom: 16,
    },
    permissionButton: {
      backgroundColor: '#2196F3',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignSelf: 'flex-start',
    },
    permissionButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    card: {
      backgroundColor: isDark ? '#1E1E1E' : 'white',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#333',
      marginBottom: 20,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    settingTextContainer: {
      flex: 1,
      marginRight: 16,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#333',
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: isDark ? '#BBBBBB' : '#666',
    },
    timeButton: {
      backgroundColor: isDark ? '#333' : '#e0e0e0',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    timeButtonText: {
      color: isDark ? '#FFFFFF' : '#333',
      fontSize: 14,
      fontWeight: '500',
    },
    testButton: {
      backgroundColor: isDark ? '#2C3E50' : '#2196F3',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    testButtonDisabled: {
      opacity: 0.5,
    },
    testButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    testButtonDescription: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
    },
    scheduleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    scheduleCount: {
      backgroundColor: isDark ? '#4CAF50' : '#4CAF50',
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      overflow: 'hidden',
    },
    scheduleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    scheduleIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    scheduleInfo: {
      flex: 1,
    },
    scheduleTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#333',
      marginBottom: 2,
    },
    scheduleSubtitle: {
      fontSize: 14,
      color: isDark ? '#BBBBBB' : '#666',
    },
    cancelButton: {
      backgroundColor: '#F44336',
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    cancelButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    debugCard: {
      backgroundColor: isDark ? '#2A2A2A' : '#f5f5f5',
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ddd',
    },
    debugTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFB74D' : '#FF9800',
      marginBottom: 8,
    },
    debugText: {
      fontSize: 12,
      color: isDark ? '#BBBBBB' : '#666',
      fontFamily: 'monospace',
    },
  });