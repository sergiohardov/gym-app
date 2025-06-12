import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Player from "@/components/workouts/session/Player";
import ListItem from "@/components/workouts/session/ListItem";
import { Stack } from "expo-router";

const WorkoutScreen = () => {
  // const { id } = useLocalSearchParams<{ id: string }>();
  // Пример данных тренировки
  const [workout, setWorkout] = useState({
    name: "Силовая тренировка",
    exercises: [
      {
        id: 1,
        name: "Жим штанги лежа",
        sets: [
          { id: 1, weight: 60, reps: 10, rest: 60 },
          { id: 2, weight: 70, reps: 8, rest: 60 },
          { id: 3, weight: 80, reps: 6, rest: 90 },
        ],
      },
      {
        id: 2,
        name: "Приседания со штангой",
        sets: [
          { id: 1, weight: 70, reps: 10, rest: 60 },
          { id: 2, weight: 90, reps: 8, rest: 60 },
          { id: 3, weight: 100, reps: 6, rest: 90 },
        ],
      },
      {
        id: 3,
        name: "Тяга штанги в наклоне",
        sets: [
          { id: 1, weight: 50, reps: 10, rest: 60 },
          { id: 2, weight: 60, reps: 8, rest: 60 },
          { id: 3, weight: 70, reps: 6, rest: 90 },
        ],
      },
    ],
  });

  // Состояние тренировки
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

  const intervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  // Таймер общей продолжительности
  useEffect(() => {
    if (isPlaying && !isWorkoutComplete) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isWorkoutComplete]);

  // Таймер перерыва
  useEffect(() => {
    if (isPlaying && isResting) {
      restIntervalRef.current = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            clearInterval(restIntervalRef.current);
            setIsResting(false);
            handleNextStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(restIntervalRef.current);
    }

    return () => clearInterval(restIntervalRef.current);
  }, [isPlaying, isResting]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = () => {
    const currentExercise = workout.exercises[currentExerciseIndex];

    // Если сейчас перерыв, переходим к следующему подходу
    if (isResting) {
      setIsResting(false);
      return;
    }

    // Проверяем, есть ли еще подходы в текущем упражнении
    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      startRestPeriod(currentExercise.sets[currentSetIndex].rest);
    }
    // Если подходы закончились, переходим к следующему упражнению
    else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      startRestPeriod(workout.exercises[currentExerciseIndex + 1].sets[0].rest);
    }
    // Если это последнее упражнение и последний подход
    else {
      setIsWorkoutComplete(true);
      setIsPlaying(false);
    }
  };

  const startRestPeriod = (seconds) => {
    setIsResting(true);
    setRestTime(seconds);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentExercise = workout.exercises[currentExerciseIndex] || {};
  const currentSet = currentExercise.sets?.[currentSetIndex] || {};

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Тренировка</Text>
              <Text>{formatTime(duration)}</Text>
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        {/* Список упражнений */}
        <FlatList
          contentContainerStyle={styles.listContent}
          data={workout.exercises}
          renderItem={({ item, index }) => (
            <ListItem
              exercise={item}
              exIndex={index}
              currentExerciseIndex={currentExerciseIndex}
              currentSetIndex={currentSetIndex}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* Миниплеер */}
        <Player
          currentExercise={currentExercise}
          isWorkoutComplete={isWorkoutComplete}
          isResting={isResting}
          restTime={restTime}
          currentSetIndex={currentSetIndex}
          togglePlayPause={togglePlayPause}
          isPlaying={isPlaying}
          handleNextStep={handleNextStep}
          formatTime={formatTime}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  listContent: {
    paddingBottom: 100, // Чтобы не перекрывалось плеером
    gap: 15,
  },
  exerciseContainer: {
    margin: 8,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  currentExercise: {
    borderLeftWidth: 4,
    borderLeftColor: "#6200ee",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  setContainer: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  currentSet: {
    backgroundColor: "#d1c4e9",
    borderLeftWidth: 4,
    borderLeftColor: "#6200ee",
  },
  completedSet: {
    opacity: 0.7,
  },
  setText: {
    fontSize: 14,
  },
});

export default WorkoutScreen;
