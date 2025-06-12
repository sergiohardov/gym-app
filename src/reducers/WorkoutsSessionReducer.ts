import { workoutSessionMock } from "@/mock/workouts";
import { WorkoutsSessionAction, WorkoutsSessionState } from "@/types/workouts";
import { useReducer } from "react";

const initialState: WorkoutsSessionState = {
  workout: workoutSessionMock,
};

function Reducer(state: WorkoutsSessionState, action: WorkoutsSessionAction): WorkoutsSessionState {
  switch (action.type) {
    default:
      return state;
  }
}

export function useWorkoutsSessionReducer() {
  return useReducer(Reducer, initialState);
}
