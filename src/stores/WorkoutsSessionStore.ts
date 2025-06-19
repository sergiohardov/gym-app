import { FullTemplateWorkout } from "@/types/db";
import { WorkoutsSessionStore, WorkoutSession } from "@/types/workouts";
import { convertFullWorkoutToSession, formatSetSubtitle } from "@/utils/format";
import { create } from "zustand";

export const useWorkoutsSessionStore = create<WorkoutsSessionStore>((set, get) => ({
  workout: {
    title: "",
    complete: false,
    exercises: [],
  },
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  durationTime: 0,
  restTime: 0,
  restTimer: null,
  status: "start",
  isResting: false,
  isPlaying: false,
  isWorkoutStart: false,
  isWorkoutEnd: false,
  playerTitle: "Загрузка тренировки...",
  playerSubtitle: "",
  isLoading: true,

  loadWorkout: (fullWorkout: FullTemplateWorkout) => {
    const sessionWorkout = convertFullWorkoutToSession(fullWorkout);

    set({
      workout: sessionWorkout,
      playerTitle: "Начните тренировку",
      playerSubtitle: "",
      isLoading: false,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      durationTime: 0,
      restTime: 0,
      restTimer: null,
      status: "start",
      isResting: false,
      isPlaying: false,
      isWorkoutStart: false,
      isWorkoutEnd: false,
    });
  },

  resetStore: () => {
    const state = get();
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }

    set({
      workout: {
        title: "",
        complete: false,
        exercises: [],
      },
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      durationTime: 0,
      restTime: 0,
      restTimer: null,
      status: "start",
      isResting: false,
      isPlaying: false,
      isWorkoutStart: false,
      isWorkoutEnd: false,
      playerTitle: "Загрузка тренировки...",
      playerSubtitle: "",
      isLoading: true,
    });
  },

  startSession: () => {
    set((state) => {
      const currentSet = state.workout.exercises[state.currentExerciseIndex].sets[state.currentSetIndex];

      return {
        status: "playing",
        playerTitle: state.workout.exercises[state.currentExerciseIndex].title,
        playerSubtitle: formatSetSubtitle(
          state.currentSetIndex + 1,
          state.workout.exercises[state.currentExerciseIndex].sets.length,
          currentSet
        ),
      };
    });
  },

  togglePlayPause: () => {
    set((state) => {
      const newStatus = state.status === "playing" ? "pause" : "playing";
      if (newStatus === "pause" && state.isResting) {
        get().pauseRest();
      } else if (newStatus === "playing" && state.isResting) {
        get().resumeRest();
      }
      return { status: newStatus };
    });
  },

  setCurrentExercise: (exerciseIndex) => {
    set({ currentExerciseIndex: exerciseIndex });
  },

  setCurrentSet: (setIndex) => {
    set({ currentSetIndex: setIndex });
  },

  setPlayerTitle: (title) => {
    set({ playerTitle: title });
  },

  setPlayerSubtitle: (subtitle) => {
    set({ playerSubtitle: subtitle });
  },

  incrementDurationTime: () => {
    set((state) => ({ durationTime: state.durationTime + 1 }));
  },

  startRest: (restDuration: number) => {
    const restTimer = setInterval(() => {
      const state = get();
      if (state.status === "playing" && state.restTime > 0) {
        set({ restTime: state.restTime - 1 });
      } else if (state.restTime <= 0) {
        get().stopRest();
        get().proceedToNextStep();
      }
    }, 1000);

    set({
      isResting: true,
      restTime: restDuration,
      restTimer,
      playerSubtitle: `Отдых: ${restDuration} сек`,
    });
  },

  pauseRest: () => {
    const state = get();
    if (state.restTimer) {
      clearInterval(state.restTimer);
      set({ restTimer: null });
    }
  },

  resumeRest: () => {
    const state = get();
    if (state.isResting && !state.restTimer) {
      const restTimer = setInterval(() => {
        const currentState = get();
        if (currentState.status === "playing" && currentState.restTime > 0) {
          set({ restTime: currentState.restTime - 1 });
        } else if (currentState.restTime <= 0) {
          get().stopRest();
          get().proceedToNextStep();
        }
      }, 1000);
      set({ restTimer });
    }
  },

  stopRest: () => {
    const state = get();
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }
    set({
      isResting: false,
      restTime: 0,
      restTimer: null,
    });
  },

  completeCurrentSet: () => {
    set((state) => {
      const newWorkout = { ...state.workout };
      newWorkout.exercises[state.currentExerciseIndex].sets[state.currentSetIndex].complete = true;
      return { workout: newWorkout };
    });
  },

  completeCurrentExercise: () => {
    set((state) => {
      const newWorkout = { ...state.workout };
      newWorkout.exercises[state.currentExerciseIndex].complete = true;
      return { workout: newWorkout };
    });
  },

  completeWorkout: () => {
    set((state) => {
      const newWorkout = { ...state.workout };
      newWorkout.complete = true;
      return {
        workout: newWorkout,
        status: "end",
        playerTitle: "Тренировка завершена!",
        playerSubtitle: "",
      };
    });
  },

  isWorkoutCompleted: () => {
    const state = get();
    return state.workout.exercises.every((exercise) => exercise.complete && exercise.sets.every((set) => set.complete));
  },

  proceedToNextStep: () => {
    const state = get();
    if (state.status === "end") return;

    const currentExercise = state.workout.exercises[state.currentExerciseIndex];
    const nextSetIndex = currentExercise.sets.findIndex((set, index) => index > state.currentSetIndex && !set.complete);

    if (nextSetIndex !== -1) {
      const nextSet = currentExercise.sets[nextSetIndex];
      set({
        currentSetIndex: nextSetIndex,
        playerTitle: currentExercise.title,
        playerSubtitle: formatSetSubtitle(nextSetIndex + 1, currentExercise.sets.length, nextSet),
      });
      return;
    }

    get().completeCurrentExercise();

    if (get().isWorkoutCompleted()) {
      get().completeWorkout();
      return;
    }

    const nextExerciseIndex = state.workout.exercises.findIndex((exercise) => !exercise.complete);

    if (nextExerciseIndex !== -1) {
      const nextExercise = state.workout.exercises[nextExerciseIndex];
      const firstSetIndex = nextExercise.sets.findIndex((set) => !set.complete);

      if (firstSetIndex !== -1) {
        const firstSet = nextExercise.sets[firstSetIndex];
        set({
          currentExerciseIndex: nextExerciseIndex,
          currentSetIndex: firstSetIndex,
          playerTitle: nextExercise.title,
          playerSubtitle: formatSetSubtitle(firstSetIndex + 1, nextExercise.sets.length, firstSet),
        });
      }
    } else {
      get().completeWorkout();
    }
  },
}));
