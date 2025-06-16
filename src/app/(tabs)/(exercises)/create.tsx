import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { router, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import { createExercise } from "db/queries";

export default function ExerciseCreateModal() {
  const [title, setTitle] = useState("");

  const handleCancel = () => {
    setTitle("");
    router.back();
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Название упражнения не может быть пустым");
      return;
    }

    try {
      const [response] = await createExercise({
        title: title,
      });

      if (response.id) {
        setTitle("");
        router.back();
      } else {
        throw new Error("UNKNOW");
      }
      // TODO: FIX TYPE
    } catch (error: any) {
      console.log(error);
      if (error.message?.includes("UNIQUE constraint failed")) {
        Alert.alert("Ошибка", "Упражнение с таким названием уже существует");
      } else if (error.message?.includes("UNKNOW")) {
        Alert.alert("Ошибка", "Произошла ошибка при создании упражнения.");
      } else {
        Alert.alert("Ошибка", "Неизвестная ошибка");
      }
    }
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

            <Button title="Добавить" callback={handleAdd} />
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
});
