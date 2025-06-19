import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Button from "@/components/base/Button";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ProfileTabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>Используется оффлайн режим</Text>

      <Button
        title="Продолжить с Google"
        icon={<AntDesign name="google" size={20} color={Colors.primary} />}
        callback={() => {}}
      />

      <Text style={styles.description}>Что бы пользоваться онлайн функциями необходима авторизация</Text>
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
