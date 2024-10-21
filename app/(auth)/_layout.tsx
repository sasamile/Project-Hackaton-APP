import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loader from "@/components/Loader";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  // Si el usuario está autenticado, redirigir al home
  if (!loading && isLogged) return <Redirect href="/home" />;

  
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* Mostrar el loader si aún está cargando el estado de autenticación */}
      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
