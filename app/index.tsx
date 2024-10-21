import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const HomeScreen = () => {
  return (
    <View style={tw`flex-1 bg-white rounded-b-[30px]`}>
      {/* Header con gradiente */}
      <View style={tw`h-[300px] w-full relative overflow-hidden `}>
        <LinearGradient
          colors={["#1C34AF", "#0A1854"]}
          style={tw`w-full h-full`}
        >
          <LinearGradient
            colors={["#00F7FF", "#1C34AF"]}
            style={[
              tw`absolute rounded-full`,
              {
                width: 120,
                height: 120,
                right: -20,
                bottom: -30,
                borderRadius: 60,
                opacity: 0.7,
              },
            ]}
          />
          <View style={tw`flex-1 justify-center items-center pt-10`}>
            <View style={tw`flex-row`}>
              <Text style={[tw`text-4xl font-bold`, { color: "#00F7FF" }]}>
                SAFE
              </Text>
              <Text style={[tw`text-4xl font-bold`, { color: "#FF5733" }]}>
                ALERT
              </Text>
            </View>
            <Text style={tw`text-[#fff] mt-2`}>
              Mantente informado,{" "}
              <Text style={{ color: "#fff" }}>mantente seguro</Text>
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Contenido principal */}
      <View style={tw`flex-1 bg-white rounded-t-[30px] -mt-12 pt-16`}>
        {/* Contenido central */}
        <View style={tw`flex-1 px-8 pt- items-center`}>
          {/* Icono circular */}
          <View style={tw`justify-center items-center mb-6`}>
            <Image
              source={require("../assets/images/shield.jpg")}
              style={{
                width: 200,
                height: 200,
                resizeMode: "contain",
              }}
            />
          </View>

          {/* Texto descriptivo */}
          <Text style={tw`text-black text-center text-lg mb-12 italic `}>
            "Tu guardián digital que organiza, conecta y te mantiene al tanto de
            los riesgos en tiempo real."
          </Text>

          {/* Botones con navegación corregida */}
          <TouchableOpacity
            style={tw`w-full bg-[#1C34AF] py-3 rounded-full mb-4`}
            onPress={() => router.push("/sign-in")}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Inicio de Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`w-full border border-[#1C34AF] py-3 rounded-full`}
            onPress={() => router.push("/sign-up")}
          >
            <Text style={tw`text-[#1C34AF] text-center text-lg font-semibold`}>
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
