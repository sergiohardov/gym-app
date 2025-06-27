import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TemplateSetsModel } from "db/models/template-sets";
import { TemplateSet } from "@/types/db";

export default function SetListItem({ item, index }) {
  const [weight, setWeight] = useState(item.weight.toString());
  const [reps, setReps] = useState(item.reps.toString());
  const [rest, setRest] = useState(item.rest.toString());
  const [isUpdateButtonVisible, setIsUpdateButtonVisible] = useState(false);

  const handleDelete = async (id) => {
    try {
      const [set] = await TemplateSetsModel.remove(id);
      if (!set.id) throw Error;
      Alert.alert("Успех", "Подход удален.");
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при удалении подхода.");
      console.log(error);
    }
  };

  const handleUpdate = async (id: TemplateSet["id"]) => {
    try {
      const set = await TemplateSetsModel.update(id, { weight: weight, reps: reps, rest: rest });
      if (!set?.id) throw Error;
      Alert.alert("Успех", "Сет обновлен");
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при обновлении сета");
      console.log(error);
    }
  };

  useEffect(() => {
    if (item.weight.toString() !== weight || item.reps.toString() !== reps || item.rest.toString() !== rest) {
      setIsUpdateButtonVisible(true);
    } else {
      setIsUpdateButtonVisible(false);
    }
  }, [weight, reps, rest]);

  return (
    <View style={styles.container}>
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>

      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <BottomSheetTextInput style={styles.inputStyles} value={weight} onChangeText={setWeight} />
          <Text style={styles.inputAfterStyles}>кг</Text>
        </View>

        <View style={styles.inputContainer}>
          <BottomSheetTextInput style={styles.inputStyles} value={reps} onChangeText={setReps} />
          <Text style={styles.inputAfterStyles}>раз</Text>
        </View>

        <View style={styles.inputContainer}>
          <BottomSheetTextInput style={styles.inputStyles} value={rest} onChangeText={setRest} />
          <Text style={styles.inputAfterStyles}>сек</Text>
        </View>
      </View>

      {isUpdateButtonVisible && (
        <TouchableOpacity onPress={() => handleUpdate(item.id)}>
          <Ionicons name="checkmark" size={24} color="green" />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="close" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  numberContainer: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 50,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  inputStyles: {
    color: Colors.primary,
    fontSize: 16,
  },
  inputAfterStyles: {
    color: Colors.primary,
  },
});
