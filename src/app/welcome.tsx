import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { router } from "expo-router";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function WelcomeScreen() {
  const { updateSetting } = useAppSettings();

  const handleUseOffline = async () => {
    const success = await updateSetting("isFirstLaunch", false);

    if (success) {
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Ошибка", "Не удалось сохранить настройки.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>Серьёзный трекинг для серьёзных тренировок в зале.</Text>

      <GoogleSignInButton />
      <TouchableOpacity onPress={handleUseOffline}>
        <Text style={styles.link}>или использовать оффлайн</Text>
      </TouchableOpacity>
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
    color: Colors.secondary,
    fontSize: 55,
    fontWeight: "bold",
  },
  link: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
});
