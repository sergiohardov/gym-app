import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "db/client";
import { workouts } from "db/schema";
import { eq } from "drizzle-orm";
import { Colors } from "@/constants/Colors";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { removeWorkout } from "db/queries";
import { router } from "expo-router";

type WorkoutPreviewListItemProps = {
  workoutId: number;
  onSwipeableWillOpen: (ref: SwipeableMethods) => void;
};

const WorkoutPreviewListItem = ({ workoutId, onSwipeableWillOpen }: WorkoutPreviewListItemProps) => {
  const swipeableRef = useRef(null);
  const [workout, setWorkout] = useState<any>({}); // TODO: FIX TYPE

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        // TODO: FIX TYPE
        const data: any = await db.query.workouts.findFirst({
          where: eq(workouts.id, workoutId),
          with: {
            workoutExercises: {
              with: {
                exercise: true, // Получаем информацию об упражнении
                sets: true, // Получаем подходы для этого упражнения в тренировке
              },
              orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
            },
          },
        });

        setWorkout({
          id: data.id,
          title: data.title,
          createdAt: data.createdAt,
          exercises: data.workoutExercises,
        });
      } catch (error) {}
    };
    fetchWorkout();
  }, []);

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={{ paddingHorizontal: 16 }}
      onSwipeableWillOpen={() => {
        if (swipeableRef.current) onSwipeableWillOpen(swipeableRef.current);
      }}
      renderRightActions={() => (
        <TouchableOpacity
          style={{
            marginRight: 16,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={async () => await removeWorkout(workoutId)}
        >
          <Ionicons name="trash" size={30} color={"red"} />
        </TouchableOpacity>
      )}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{workout?.title}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="barbell-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{workout?.exercises?.length} упражнений</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.detailText}>45 мин</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            router.navigate("session/" + workoutId);
          }}
        >
          <Ionicons name="play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ReanimatedSwipeable>
  );
};

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
});

export default WorkoutPreviewListItem;
