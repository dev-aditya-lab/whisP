import { Text, View } from "react-native";

export default function AuthFooter() {
  return (
          <View className="mt-auto">
            <Text className="text-gray-500 text-xs text-center leading-5">
              By continuing, you accept our <Text className="text-blue-500">Terms & Privacy Policy</Text>.
            </Text>
            <Text className="text-gray-500 text-xs text-center leading-5">
              Made in Bharat with ❤️
            </Text>
          </View>
  )
}
