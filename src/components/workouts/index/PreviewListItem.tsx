import { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { router } from "expo-router";
import { TemplateWorkout } from "@/types/db";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import * as Haptics from "expo-haptics";

type PreviewListItemProps = {
  workoutId: TemplateWorkout["id"];
  workoutName: TemplateWorkout["name"];
  exercisesCount: number;
  onSwipeableWillOpen: (ref: SwipeableMethods) => void;
  handleRefresh: () => void;
};

export default function PreviewListItem({
  workoutId,
  exercisesCount,
  workoutName,
  onSwipeableWillOpen,
  handleRefresh,
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
            const [request] = await TemplateWorkoutsModel.remove(workoutId);
            if (!request.id) throw Error;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            handleRefresh();
          } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Ошибка", "Не удалось удалить тренировку");
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`edit/${workoutId}`);
  };

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`session/${workoutId}`);
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={{
        paddingHorizontal: 16,
      }}
      onSwipeableWillOpen={() => {
        if (swipeableRef.current) onSwipeableWillOpen(swipeableRef.current);
      }}
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
          <View style={styles.deleteIcon}>
            <Ionicons name="trash" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.deleteText}>Удалить</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity style={styles.container} onPress={handleEdit} activeOpacity={0.95}>
        <View style={styles.contentContainer}>
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
                <Ionicons name="warning-outline" size={18} color={Colors.orange} />
                <Text style={[styles.detailText, { color: Colors.orange }]}>Добавьте упражнения</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, !hasExercises && { backgroundColor: Colors.orange }]}
          onPress={hasExercises ? handleStart : handleEdit}
        >
          <Ionicons name={hasExercises ? "play" : "add"} size={24} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: Colors.red,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  deleteIcon: {
    marginBottom: 4,
  },
  deleteText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.surface,
  },
  actionButton: {
    backgroundColor: Colors.secondary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
