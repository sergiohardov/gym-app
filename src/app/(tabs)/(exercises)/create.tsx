import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/Input";
import { exercises } from "db/schema";
import { db } from "db/client";

export default function ExerciseCreateModal() {
  const [title, setTitle] = useState("");

  const handleCancel = () => {
    setTitle("");
    router.back();
  };

  const handleAdd = async () => {
    await db.insert(exercises).values({
      title: title,
    });

    setTitle("");
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.fullFlex}>
        <KeyboardAvoidingView
          style={styles.fullFlex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={110}
        >
          <View style={styles.container}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Название</Text>
              <Input value={title} setValue={setTitle} autofocus={true} />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAdd}>
              <Text style={styles.buttonText}>Добавить</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  fullFlex: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  inputLabel: {
    color: Colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  inputField: {
    borderColor: Colors.secondary,
    borderWidth: 1,
    width: "100%",
    backgroundColor: Colors.primary,
    padding: 16,
  },
  button: {
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    justifyContent: "center",
    padding: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
