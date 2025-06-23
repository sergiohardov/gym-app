import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { router } from "expo-router";
import { FullTemplateWorkout, TemplateWorkout } from "@/types/db";
import { TemplateWorkoutsModel } from "db/models/template-workouts";

// TODO: Replace type props to workouts.ts
// TODO: When data undefined or broken add logic for catch in use effect
// TODO: Create link to session workout

type WorkoutPreviewListItemProps = {
  workoutId: TemplateWorkout["id"];
  onSwipeableWillOpen: (ref: SwipeableMethods) => void;
};

export default function WorkoutPreviewListItem({ workoutId, onSwipeableWillOpen }: WorkoutPreviewListItemProps) {
  const [workout, setWorkout] = useState<FullTemplateWorkout | undefined>(undefined);
  const swipeableRef = useRef(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const data = await TemplateWorkoutsModel.getFullById(workoutId);
        if (data) {
          setWorkout(data);
        }
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
        <>
          <TouchableOpacity
            style={{
              marginRight: 16,
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={async () => await TemplateWorkoutsModel.remove(workoutId)}
          >
            <Ionicons name="trash" size={30} color={"red"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginRight: 16,
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.push(`edit/${workout?.id}`)}
          >
            <Ionicons name="pencil" size={30} color={Colors.secondary} />
          </TouchableOpacity>
        </>
      )}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{workout?.name}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="barbell-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{workout?.templateExercises.length} упражнений</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.detailText}>45 мин</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={() => router.push(`session/${workout?.id}`)}>
          <Ionicons name="play" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
});
