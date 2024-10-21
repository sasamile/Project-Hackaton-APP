import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";

// Definir la interfaz de los props
interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyle?: string;
  isLoading?: boolean;
}

export default function CustomButton({
  title,
  handlePress,
  containerStyle,
  isLoading = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        tw`bg-blue-500 rounded-xl min-h-[62px] justify-center items-center`,
        containerStyle ? tw`${containerStyle}` : undefined,
      ]}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={tw`text-white font-semibold text-lg`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
