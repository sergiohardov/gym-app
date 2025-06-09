import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { ReactNode } from "react";
import { Colors } from "@/constants/Colors";

export default function Button({
  title = "",
  icon = null,
  disabled,
  callback,
}: {
  title?: string;
  icon?: ReactNode;
  disabled?: boolean;
  callback: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={callback}
      disabled={disabled}
    >
      {icon}
      {title && <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 6,
    gap: 10,
  },
  buttonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  disabled: {
    backgroundColor: Colors.surface,
  },
});
