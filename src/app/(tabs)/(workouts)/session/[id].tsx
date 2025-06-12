import { WorkoutsSessionProvider } from "@/contexts/WorkoutsSessionContext";
import WorkoutsSessionScreen from "@/components/workouts/session/Screen";

export default function WorkoutsSession() {
  return (
    <WorkoutsSessionProvider>
      <WorkoutsSessionScreen />
    </WorkoutsSessionProvider>
  );
}
