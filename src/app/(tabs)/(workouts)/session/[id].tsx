import ExercisesList from "@/components/workouts/session/ExercisesList";
import Header from "@/components/workouts/session/Header";
import Player from "@/components/workouts/session/Player";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { getFullWorkout } from "db/queries";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function WorkoutsSessionScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ExercisesList />
      <Player />
    </View>
  );
}
