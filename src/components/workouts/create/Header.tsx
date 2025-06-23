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
    padding: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
