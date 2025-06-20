import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { Colors } from "@/constants/Colors";

export default function Card({ children, style = {} }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: "#aeaeae",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
});
