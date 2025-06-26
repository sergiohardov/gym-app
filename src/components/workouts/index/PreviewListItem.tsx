import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { router } from "expo-router";
import { TemplateWorkout } from "@/types/db";
import { TemplateWorkoutsModel } from "db/models/template-workouts";

type PreviewListItemProps = {
  workoutId: TemplateWorkout["id"];
  workoutName: TemplateWorkout["name"];
  exercisesCount: number;
  onSwipeableWillOpen: (ref: SwipeableMethods) => void;
};

export default function PreviewListItem({
  workoutId,
  exercisesCount,
  workoutName,
  onSwipeableWillOpen,
}: PreviewListItemProps) {
  const swipeableRef = useRef(null);
  const hasExercises = exercisesCount > 0;

  const handleDelete = async () => {
    Alert.alert("Удалить тренировку?", "Это действие нельзя отменить", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            await TemplateWorkoutsModel.remove(workoutId);
          } catch (error) {
            Alert.alert("Ошибка", "Не удалось удалить тренировку");
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    router.push(`edit/${workoutId}`);
  };

  const handleStart = () => {
    router.push(`session/${workoutId}`);
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={{ paddingHorizontal: 16 }}
      onSwipeableWillOpen={() => {
        if (swipeableRef.current) onSwipeableWillOpen(swipeableRef.current);
      }}
      renderRightActions={() => (
        <TouchableOpacity style={styles.swipeButton} onPress={handleDelete}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity style={styles.container} onPress={handleEdit}>
        <View style={styles.content}>
          <Text style={styles.title}>{workoutName}</Text>

          <View style={styles.detailsContainer}>
            {hasExercises ? (
              <>
                <View style={styles.detailItem}>
                  <Ionicons name="barbell-outline" size={18} color={Colors.surface} />
                  <Text style={styles.detailText}>
                    {exercisesCount} {exercisesCount === 1 ? "упражнение" : "упражнений"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={18} color={Colors.surface} />
                  <Text style={styles.detailText}>45 мин</Text>
                </View>
              </>
            ) : (
              <View style={styles.detailItem}>
                <Ionicons name="warning-outline" size={18} color={Colors.surface} />
                <Text style={styles.detailText}>Добавьте упражнения</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={hasExercises ? handleStart : handleEdit}>
          <Ionicons name={hasExercises ? "play" : "add"} size={24} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  playButton: {
    backgroundColor: Colors.secondary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  swipeButton: {
    marginRight: 16,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
