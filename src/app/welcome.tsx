import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAppSettings } from "@/hooks/useAppSettings";
import Button from "@/components/base/Button";
import AntDesign from "@expo/vector-icons/AntDesign";

const text = "Серьёзный трекинг для серьёзных тренировок.".split(" ");

export default function WelcomeScreen() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(text.length).fill(false));
  const { updateSetting } = useAppSettings();

  const handleUseOffline = async () => {
    const success = await updateSetting("isFirstLaunch", false);

    if (success) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Ошибка", "Не удалось сохранить настройки.");
    }
  };

  useEffect(() => {
    text.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, index * 700);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        {text.map((word, index) => visibleItems[index] && <Text key={index}>{word} </Text>)}
      </Text>

      <Button
        title="Продолжить с Google"
        icon={<AntDesign name="google" size={20} color={Colors.primary} />}
        callback={() => {}}
      />
      
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
