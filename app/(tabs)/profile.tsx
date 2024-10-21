import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { logOut } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const ProfileMenuScreen = () => {
  const router = useRouter();
  const { setIsLogged, setUser, user } = useGlobalContext();

  const menuItems = [
    { id: "1", title: "Configuracion" },
    { id: "2", title: "PQR" },
    { id: "3", title: "Configuracion" },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      setIsLogged(false);
      setUser(null);
      router.replace("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta nuevamente.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      {/* Header */}
      <View style={tw`px-4 py-2`}>
        <Text style={tw`text-lg`}>
          <Text style={tw`text-[#00F7FF] font-bold`}>SAFE</Text>
          <Text style={tw`text-[#FF5733] font-bold`}>ALERT</Text>
        </Text>
      </View>

      {/* Profile Section */}
      <View
        style={tw`px-4 py-3 bg-zinc-900 rounded-xl mx-4 mt-4 flex-row items-center`}
      >
        <View
          style={tw`bg-gray-600  rounded-full w-16 h-16 flex justify-center items-center`}
        >
          <Image
            source={require("../../assets/icons/profile.png")}
            style={tw`w-12 h-12 p-2 rounded-full`}
          />
        </View>
        <View>
          <Text style={tw`text-white text-lg font-semibold ml-3`}>
            {user?.name}
          </Text>
          <Text style={tw`text-white text-lg font-semibold ml-3`}>
            {user?.email}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      {/* <View style={tw`mt-6 px-4`}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={tw`py-4 border-b border-zinc-800`}
            // onPress={() => router.push(`/${item.title.toLowerCase()}`)}
          >
            <Text style={tw`text-white text-lg`}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Logout Button */}
      <View style={tw`flex-1 justify-end px-4 pb-8`}>
        <TouchableOpacity
          style={tw`bg-red-600 py-4 rounded-xl`}
          onPress={handleLogout}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileMenuScreen;
