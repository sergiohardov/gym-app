import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Серьёзный трекинг для серьёзных тренировок в зале.
      </Text>
      <GoogleSignInButton />
      <Text style={styles.link}>или использовать оффлайн</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    gap: 20,
  },
  description: {
    fontSize: 55,
    fontWeight: "bold",
  },
  link: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
});
