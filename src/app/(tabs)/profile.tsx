import { View, Text, StyleSheet } from "react-native";
import React from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Colors } from "@/constants/Colors";

export default function ProfileTabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>Используется оффлайн режим</Text>
      <GoogleSignInButton />
      <Text style={styles.description}>
        Что бы пользоваться онлайн функциями необходима авторизация
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 16,
  },
  description: {
    color: Colors.surface,
    textAlign: "center",
  },
});
