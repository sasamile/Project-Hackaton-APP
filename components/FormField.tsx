import { Text, TextInput, View } from "react-native";
import tw from "twrnc";

interface FormFieldProps {
  title: string;
  value: any;
  placeholder: string;
  handleChangeText: (value: any) => void;
  otherStyles?: string;
  keyboardType?:
    | "email-address"
    | "phone-pad"
    | "numeric"
    | "default"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "name-phone-pad"
    | "decimal-pad"
    | "twitter"
    | "web-search"
    | undefined;
}

export default function FormField({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
}: FormFieldProps) {
  return (
    <View style={tw`${otherStyles || ''}`}>
      <Text style={tw`text-base text-gray-700 font-medium mb-2`}>
        {title}
      </Text>
      <View style={tw`w-full h-16 px-4 bg-gray-200 rounded-2xl justify-center`}>
        <TextInput
          style={tw`text-gray-900 font-semibold text-base w-full`}
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          placeholderTextColor="gray"
        />
      </View>
    </View>
  );
}