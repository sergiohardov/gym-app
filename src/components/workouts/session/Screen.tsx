import { View } from "react-native";
import ExercisesList from "@/components/workouts/session/ExercisesList";
import Player from "@/components/workouts/session/Player";
import Header from "@/components/workouts/session/Header";

export default function WorkoutsSessionScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ExercisesList />
      <Player />
    </View>
  );
}
