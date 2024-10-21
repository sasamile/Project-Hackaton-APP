import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = () => {
  const position1 = useRef(new Animated.Value(0)).current;
  const position2 = useRef(new Animated.Value(0)).current;
  const position3 = useRef(new Animated.Value(0)).current;

  // Animación para la primera bola
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(position1, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(position1, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [position1]);

  // Animación para la segunda bola
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(position2, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(position2, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [position2]);

  // Animación para la tercera bola
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(position3, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(position3, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [position3]);

  // Interpolaciones para cada bola
  const translateY1 = position1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const translateY2 = position2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });

  const translateY3 = position3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={tw`flex-1 items-center justify-center bg-black relative`}>
      {/* Círculo grande superior */}
      <Animated.View style={{ transform: [{ translateY: translateY1 }] }}>
        <LinearGradient
          colors={["#00F7FF", "#1C34AF"]}
          style={[
            tw`absolute rounded-full`,
            {
              width: 100,
              height: 100,
              top: "15%",
              right: "20%",
              borderRadius: 50,
            },
          ]}
        />
      </Animated.View>

      {/* Círculo grande inferior */}
      <Animated.View style={{ transform: [{ translateY: translateY2 }] }}>
        <LinearGradient
          colors={["#00F7FF", "#1C34AF"]}
          style={[
            tw`absolute rounded-full`,
            {
              width: 120,
              height: 120,
              bottom: "30%",
              right: "10%",
              borderRadius: 60,
            },
          ]}
        />
      </Animated.View>

      {/* Círculo pequeño azul oscuro */}
      <Animated.View style={{ transform: [{ translateY: translateY3 }] }}>
        <LinearGradient
          colors={["#1C34AF", "#0A1854"]}
          style={[
            tw`absolute rounded-full`,
            {
              width: 50,
              height: 50,
              bottom: "20%",
              left: "30%",
              borderRadius: 25,
            },
          ]}
        />
      </Animated.View>

      {/* Círculo más pequeño */}
      <LinearGradient
        colors={["#1C34AF", "#0A1854"]}
        style={[
          tw`absolute rounded-full`,
          {
            width: 30,
            height: 30,
            bottom: "15%",
            left: "40%",
            borderRadius: 15,
          },
        ]}
      />

      {/* Marco exterior con gradiente */}
      <LinearGradient
        colors={["#00F7FF", "#1C34AF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          tw`absolute`,
          {
            width: "100%",
            height: "100%",
            opacity: 0.5,
            borderWidth: 2,
            borderRadius: 20,
          },
        ]}
      />

      {/* Contenido central */}
      <View style={tw`z-10 `}>
        <View style={tw`flex-row justify-center`}>
          <Text style={[tw`text-4xl font-bold`, { color: "#00F7FF" }]}>
            SAFE
          </Text>
          <Text style={[tw`text-4xl font-bold`, { color: "#FF5733" }]}>
            ALERT
          </Text>
        </View>

        <Text style={[tw`text-[#00F7FF] text-center mt-2`]}>
          Mantente informado,{" "}
          <Text style={{ color: "#4169FF" }}>mantente seguro</Text>
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
