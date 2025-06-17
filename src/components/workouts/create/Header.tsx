import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useWorkoutsCreateContext } from "@/contexts/WorkoutsCreateContext";
import { Colors } from "@/constants/Colors";

export default function Header() {
  const { handleCancel, handleSave } = useWorkoutsCreateContext();

  return (
    <Stack.Screen
      options={{
        title: "",
        headerTransparent: true,
        headerLeft: () => (
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.secondary} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Сохранить</Text>
            <Ionicons name="checkmark" size={20} color={Colors.primary} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  closeButton: {
    padding: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  saveButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
