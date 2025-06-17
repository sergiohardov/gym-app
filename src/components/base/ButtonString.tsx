import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { Colors } from "@/constants/Colors";

export default function ButtonString({
  title = "",
  icon = null,
  disabled = false,
  callback,
}: {
  title?: string;
  icon?: ReactNode;
  disabled?: boolean;
  callback: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={callback} disabled={disabled}>
      {icon}
      {title && <Text style={[styles.buttonText, disabled && styles.disabled]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 6,
    gap: 10,
  },
  buttonText: {
    color: Colors.secondary,
    fontWeight: "bold",
    fontSize: 16,
  },
  disabled: {
    color: Colors.surface,
  },
});
