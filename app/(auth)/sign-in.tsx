import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";
import FormField from "@/components/FormField";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { getCurrentUser, logOut, SignIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const screenHeight = Dimensions.get("window").height;

const Login = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await SignIn(form.email, form.password);
      const result = await getCurrentUser();
      const user = result
        ? { id: result.$id, name: result.username, email: result.email }
        : null;
      setUser(user);
      setIsLogged(true);
      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  const checkAuth = async () => {
    try {
      const cachedUser = localStorage.getItem("user"); // Verificar si hay un usuario en caché
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setIsLogged(true);
        setIsLogged(false);
        return;
      }

      const res = await getCurrentUser();
      if (res) {
        const user = {
          id: res.$id,
          name: res.username,
          email: res.email,
        };
        setIsLogged(true);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user)); // Almacenar en caché
      } else {
        setIsLogged(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Auth check error:", error);
      setIsLogged(false);
      setUser(null);
    } finally {
      setIsLogged(false);
    }
  };

  useEffect(() => {
    checkAuth(); // Asegúrate de que esta función no se llame innecesariamente
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        translucent={true}
      />
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <SafeAreaView
          style={[
            tw`flex-1 bg-white`,
            { marginTop: StatusBar.currentHeight || 0 },
          ]}
        >
          <ScrollView style={tw`flex-1`} contentContainerStyle={tw`grow`}>
            <View
              style={[
                tw`flex-1 bg-white relative`,
                { minHeight: screenHeight - (StatusBar.currentHeight || 0) },
              ]}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={tw`flex-row p-4 items-center`}
                //@ts-ignore
                onPress={() => router.push("/")}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={tw`ml-2`}>Volver</Text>
              </TouchableOpacity>

              {/* Form Section */}
              <View style={tw`p-4 mt-8`}>
                <Text style={tw`text-3xl text-center font-bold mb-8`}>
                  Iniciar Sesion
                </Text>
                <View style={tw`gap-4`}>
                  <FormField
                    placeholder="Joe@gmail.com"
                    title="Email"
                    value={form.email}
                    handleChangeText={(e: string) =>
                      setForm({ ...form, email: e })
                    }
                    otherStyles="mb-4"
                    keyboardType="email-address"
                  />
                  <FormField
                    placeholder="********"
                    title="Password"
                    value={form.password}
                    handleChangeText={(e: string) =>
                      setForm({ ...form, password: e })
                    }
                    otherStyles="mb-4"
                  />
                  <CustomButton
                    title="Sign In"
                    handlePress={submit}
                    containerStyle="mb-4"
                    isLoading={isSubmitting}
                  />

                  <View style={tw`flex-row justify-center items-center py-4`}>
                    <Text style={tw`text-lg text-gray-700`}>
                      Don't have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      //@ts-ignore
                      onPress={() => router.push("/sign-up")}
                    >
                      <Text style={tw`text-lg text-blue-600 font-medium`}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Gradient Footer */}
              <View
                style={[
                  tw`w-full overflow-hidden mt-auto rounded-t-3xl`,
                  { height: 200 },
                ]}
              >
                <LinearGradient
                  colors={["#1C34AF", "#0A1854"]}
                  style={tw`w-full h-full`}
                >
                  <View style={tw`flex-1 justify-center items-center`}>
                    <View style={tw`flex-row`}>
                      <Text
                        style={[tw`text-4xl font-bold`, { color: "#00F7FF" }]}
                      >
                        SAFE
                      </Text>
                      <Text
                        style={[tw`text-4xl font-bold`, { color: "#FF5733" }]}
                      >
                        ALERT
                      </Text>
                    </View>
                    <Text style={tw`text-white mt-2`}>
                      Mantente informado{" "}
                      <Text style={tw`text-white`}>mantente seguro</Text>
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;
