import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useWorkoutsEditStore } from "@/stores/WorkoutsEditStore";
import { Colors } from "@/constants/Colors";

export default function Header() {
  const { workout, setIsAddModalVisible } = useWorkoutsEditStore();
  if (!workout) return null;

  return (
    <Stack.Screen
      options={{
        title: workout.name,
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
