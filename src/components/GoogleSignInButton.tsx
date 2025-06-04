import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function GoogleSignInButton() {
  return (
    <View style={styles.container}>
      <AntDesign name="google" size={20} color={Colors.primary} />
      <Text style={styles.title}>Продолжить с Google</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
