import ExercisesList from "@/components/workouts/session/ExercisesList";
import Header from "@/components/workouts/session/Header";
import Player from "@/components/workouts/session/Player";
import { View } from "react-native";

export default function WorkoutsSessionScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ExercisesList />
      <Player />
    </View>
  );
}
