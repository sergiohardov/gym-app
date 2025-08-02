import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as Haptics from "expo-haptics";

export default function Header({
  title,
  setIsAddModalVisible,
}: {
  title: string;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Stack.Screen
      options={{
        title: title,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsAddModalVisible(true);
            }}
          >
            <Ionicons name="add-circle-outline" size={30} color={Colors.secondary} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
