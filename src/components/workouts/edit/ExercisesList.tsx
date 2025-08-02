import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { useWorkoutsEditStore } from "@/stores/WorkoutsEditStore";
import EmptyScreen from "@/components/base/EmptyScreen";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function ExercisesList() {
  const { workout, refreshing, refreshWorkout, setIsEditModalVisible, setCurrentExerciseId } = useWorkoutsEditStore();
  const [newRefreshing, setNewRefreshing] = useState(false);

  if (!workout) return null;

  //TODO: Fix this refresh state (remove useEffect/useState & optimize)
  useEffect(() => {
    setNewRefreshing(refreshing);
  }, [refreshing]);

  return (
    <View style={styles.container}>
      {workout.templateExercises.length ? (
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={styles.listContentContainer}
          data={workout.templateExercises}
          refreshing={newRefreshing}
          onRefresh={() => refreshWorkout(workout.id)}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.listItemContainer}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentExerciseId(item.id);
                setIsEditModalVisible(true);
              }}
            >
              <View style={styles.numberContainer}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.textTitle}>{item.exercise.name}</Text>
                <Text style={styles.textSubtitle}>
                  {item.sets.length ? `${item.sets.length} Подходов` : "Без подходов"}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={Colors.surface} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <EmptyScreen
          icon="barbell"
          title="Упражнения не добавлены"
          subtitle="Добавьте первое упражнение для этой тренировки"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingVertical: 16,
  },
  listContentContainer: {
    gap: 10,
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  numberContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 50,
    padding: 8,
  },
  numberText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textSubtitle: {
    color: Colors.surface,
    fontSize: 14,
  },
});
