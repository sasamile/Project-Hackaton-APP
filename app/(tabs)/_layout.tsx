import { Redirect, Tabs } from "expo-router";
import Splash from "../+not-found";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import React, { useEffect } from "react";
import Loader from "@/components/Loader";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import tw from "twrnc";
import * as Notifications from "expo-notifications";

import { ImageSourcePropType } from "react-native"; // Para el tipo de imagen

export default function TabsLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (loading) {
    return <Splash />;
  }

  // Si no está autenticado, no mostrar las tabs
  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  // Solicitar permisos para recibir notificaciones
  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Se requieren permisos para mostrar notificaciones.");
    }
  };

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home} // Icono de inicio
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="alert"
          options={{
            title: "Alerta",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.alert} // Icono de alerta
                color={color}
                name="Alert"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile} // Icono de perfil
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}

interface TabIconProps {
  icon: ImageSourcePropType; // Tipo de imagen para el icono
  color: string; // Color del icono
  name: string; // Nombre del tab
  focused: boolean; // Estado de enfoque
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View style={tw`flex items-center justify-center gap-2`}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[tw`w-6 h-6`, { tintColor: color }]} // Aplicar el color como estilo
      />
      <Text
        style={tw`${
          focused ? "font-semibold" : "font-regular"
        } text-xs text-white`}
      >
        {name}
      </Text>
    </View>
  );
};
