import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TemplateSetsModel } from "db/models/template-sets";
import { TemplateExercise, TemplateSet } from "@/types/db";
import { useWorkoutsEditStore } from "@/stores/WorkoutsEditStore";
import { Colors } from "@/constants/Colors";

export default function SetListItem({
  item,
  index,
  refreshExercise,
}: {
  item: TemplateSet;
  index: number;
  refreshExercise: (id: TemplateExercise["id"]) => void;
}) {
  const { workout, refreshWorkout, currentExerciseId } = useWorkoutsEditStore();

  const [isLoading, setIsLoading] = useState(false);

  if (!workout) return null;
  if (!currentExerciseId) return null;

  const handleDelete = async (id: TemplateSet["id"]) => {
    try {
      const [set] = await TemplateSetsModel.remove(id);
      if (!set.id) throw Error;
      refreshWorkout(workout.id);
      refreshExercise(currentExerciseId);
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при удалении подхода.");
      console.log(error);
    }
  };

  const handleUpdate = (title: string, id: TemplateSet["id"], keyOfSet: keyof TemplateSet) => {
    if (isLoading) return;

    Alert.prompt(
      title,
      "",
      [
        {
          text: "Отмена",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "ОК",
          onPress: async (text) => {
            try {
              setIsLoading(true);
              const set = await TemplateSetsModel.update(id, { [keyOfSet]: text ? +text : 0 });
              if (!set?.id) throw Error;
              refreshExercise(currentExerciseId);
            } catch (error) {
              Alert.alert("Ошибка", "Ошибка при обновлении сета");
              console.log(error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      "plain-text",
      "",
      "numeric"
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.numberContainer}>
        {isLoading ? <ActivityIndicator /> : <Text style={styles.numberText}>{index + 1}</Text>}
      </View>

      <View style={styles.inputsContainer}>
        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => handleUpdate("Введите вес", item.id, "weight")}
          disabled={isLoading}
        >
          <Text style={styles.inputButtonText}>{item.weight || 0} кг</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => handleUpdate("Количество повторений", item.id, "reps")}
          disabled={isLoading}
        >
          <Text style={styles.inputButtonText}>{item.reps || 0} раз</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => handleUpdate("Длительность отдыха", item.id, "rest")}
          disabled={isLoading}
        >
          <Text style={styles.inputButtonText}>{item.rest || 0} сек</Text>
        </TouchableOpacity>
      </View>

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
  inputButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  inputButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
});
