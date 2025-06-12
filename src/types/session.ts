export interface WorkoutSet {
  id: number;
  complete: boolean;
  weight: number;
  reps: number;
  rest: number;
}

export interface Exercise {
  id: number;
  name: string;
  complete: boolean;
  sets: WorkoutSet[];
}

export interface Workout {
  name: string;
  complete: boolean;
  exercises: Exercise[];
}