import { WorkoutsCreateProvider } from "@/contexts/WorkoutsCreateContext";
import WorkoutCreateScreen from "@/components/workouts/create/WorkoutsCreateScreen";

export default function WorkoutCreate() {
  return (
    <WorkoutsCreateProvider>
      <WorkoutCreateScreen />
    </WorkoutsCreateProvider>
  );
}
