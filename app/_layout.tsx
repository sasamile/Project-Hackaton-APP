import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import Splash from "./+not-found";
import tw, { useDeviceContext } from "twrnc";
import GlobalProvider from "@/context/GlobalProvider";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GlobalProvider>
      <RootLayoutNav />
    </GlobalProvider>
  );
}

function RootLayoutNav() {
  useDeviceContext(tw);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      SplashScreen.hideAsync();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return null;
  }

  if (isLoading) {
    return <Splash />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: "", // Esto asegura que no haya título
          }}
        />
        <Stack.Screen
          name="alert"
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="alert/[id]"
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            title: "",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "",
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: false,
            title: "",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
