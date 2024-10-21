import { View, ActivityIndicator, Dimensions, Platform } from "react-native";
import tw from "twrnc";

const Loader = ({ isLoading }: { isLoading: boolean }) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      //   Sty="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={[
        tw`absolute flex justify-center items-center w-full h-full bg-primary/60 z-10`,
        { height: screenHeight },
      ]}
      // height: screenHeight,
      //   }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
