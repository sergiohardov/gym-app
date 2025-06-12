import React from "react";
import WorkoutsSessionScreen from "@/components/workouts/session/Screen";
import { WorkoutsSessionProvider } from "@/contexts/WorkoutsSessionContext";

export default function WorkoutsSession() {
  return (
    <WorkoutsSessionProvider>
      <WorkoutsSessionScreen />
    </WorkoutsSessionProvider>
  );
}
