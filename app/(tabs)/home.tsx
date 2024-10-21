import { View, Text, TouchableOpacity, Image, FlatList, AppState } from "react-native";
import { router } from "expo-router";
import tw from "twrnc";
import { useEffect, useRef, useState } from "react";
import { GetAlert } from "@/api/cmsget";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

// Configuración global de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

const BACKGROUND_FETCH_TASK = "background-fetch";

// Sistema de caché global para notificaciones procesadas
let processedNotificationIds = new Set<string>();

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const now = new Date();
    const alerts = await GetAlert();
    let hasNewData = false;

    for (const alert of alerts) {
      const createdAt = new Date(alert.createdAt);
      const timeDiff = (now.getTime() - createdAt.getTime()) / 1000 / 60;

      if (timeDiff < 2 && !processedNotificationIds.has(alert.id)) {
        processedNotificationIds.add(alert.id);
        hasNewData = true;
      }
    }

    return hasNewData
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "Baja" | "Media" | "Alta";
  affectedArea: [number, number];
  affectedAreaRadius: number;
  entityId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  entity: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean | null;
    password: string;
    image: string | null;
    role: string;
    entityId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function HomeScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const isLoadingRef = useRef(false);

  const configureNotifications = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.error('Failed to get push notification permissions');
      return;
    }

    // Limpiar todas las notificaciones existentes al iniciar
    await Notifications.dismissAllNotificationsAsync();

    // Configurar listener para notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification);
      }
    );

    // Configurar listener para respuestas a notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        const alertId = response.notification.request.content.data?.alertId;
        if (alertId) {
          // Limpiar la notificación específica
          Notifications.dismissNotificationAsync(response.notification.request.identifier);
          // Navegar a la alerta
          navigateToAlert(alertId);
        }
      }
    );
  };

  const navigateToAlert = (alertId: string) => {
    router.push({
      //@ts-ignore
      pathname: `/alert/${alertId}`,
    });
  };

  const registerBackgroundFetch = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 30,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (err) {
      console.error("Background task registration failed:", err);
    }
  };

  const setupAppStateListener = () => {
    AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        loadAlerts();
      }
      appState.current = nextAppState;
      setAppStateVisible(nextAppState);
    });
  };

  const sendNotification = async (alert: Alert) => {
    if (processedNotificationIds.has(alert.id)) return;

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🚨 ${alert.severity === "Alta" ? "URGENTE" : "Nueva Alerta"}: ${alert.title}`,
          body: `${alert.entity.name}: ${alert.description}`,
          data: { alertId: alert.id },
          sound: true,
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null,
      });

      processedNotificationIds.add(alert.id);
      return notificationId;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const loadAlerts = async () => {
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      const fetchedAlerts = await GetAlert();
      setAlerts(fetchedAlerts);

      const now = new Date();
      for (const alert of fetchedAlerts) {
        const createdAt = new Date(alert.createdAt);
        const timeDiff = (now.getTime() - createdAt.getTime()) / 1000 / 60;

        if (timeDiff < 2 && !processedNotificationIds.has(alert.id)) {
          await sendNotification(alert);
        }
      }
    } catch (error) {
      console.error("Error loading alerts:", error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const setupApp = async () => {
      await configureNotifications();
      await registerBackgroundFetch();
      setupAppStateListener();
      await loadAlerts();
    };

    setupApp();

    const intervalId = setInterval(loadAlerts, 30000);

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      clearInterval(intervalId);
    };
  }, []);

  const getEntityImage = (entityName: string) => {
    switch (entityName) {
      case "Oficina de Gestión de Riesgos":
        return require("../../assets/images/caso3.png");
      case "Bomberos":
        return require("../../assets/images/caso2.png");
      case "Policía":
        return require("../../assets/images/caso1.png");
      default:
        return require("../../assets/images/caso4.png");
    }
  };

  const renderItem = ({ item }: { item: Alert }) => {
    const maxTitleLength = 30;
    const maxDescriptionLength = 100;

    const truncatedTitle =
      item.title.length > maxTitleLength
        ? item.title.substring(0, maxTitleLength) + "..."
        : item.title;

    const truncatedDescription =
      item.description.length > maxDescriptionLength
        ? item.description.substring(0, maxDescriptionLength) + "..."
        : item.description;

    return (
      <View style={tw`bg-gray-800 p-4 rounded-xl mb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Image
            source={getEntityImage(item.entity.name)}
            style={tw`w-10 h-10 mr-4`}
          />
          <Text style={tw`text-lg text-white font-bold flex-1`} numberOfLines={1}>
            {truncatedTitle}
          </Text>
        </View>
        <Text style={tw`text-gray-400 mb-4`} numberOfLines={2}>
          {truncatedDescription}
        </Text>
        <View style={tw`flex-row justify-between items-center`}>
          <TouchableOpacity
            style={tw`bg-orange-500 rounded-full px-4 py-2`}
            onPress={() => navigateToAlert(item.id)}
          >
            <Text style={tw`text-white font-semibold`}>Saber más</Text>
          </TouchableOpacity>
          <View style={tw`flex-row items-center`}>
            {item.severity === "Alta" && (
              <View style={tw`bg-red-500 rounded-full w-2 h-2 mr-2`} />
            )}
            <Text style={tw`text-gray-500 text-xs`}>
              Creado{" "}
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`bg-black flex-1 p-4 mt-12`}>
      <View style={tw`flex-row justify-center items-center mb-4`}>
        <View style={tw`flex-row`}>
          <Text style={[tw`text-2xl font-bold`, { color: "#00F7FF" }]}>
            SAFE
          </Text>
          <Text style={[tw`text-2xl font-bold`, { color: "#FF5733" }]}>
            ALERT
          </Text>
        </View>
      </View>

      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-20`}
      />
    </View>
  );
}