import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutsCreateContext } from "@/contexts/WorkoutsCreateContext";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import WorkoutExerciseModal from "@/components/workouts/create/WorkoutsCreateExercisesModal";
import WorkoutExerciseCard from "@/components/workouts/create/WorkoutsCreateExerciseCard";

export default function WorkoutsCreateScreen() {
  const { state, dispatch, handleCancel, handleSave } = useWorkoutsCreateContext();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Создать тренировку",
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Ionicons name="checkmark" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Название</Text>
            <Input
              placeholder="Введите название тренировки"
              value={state.title}
              setValue={(value) => dispatch({ type: "SET_TITLE", payload: value })}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{`Упражнения (${state.exercises.length})`}</Text>

            {state.exercises.map((exercise, exerciseIndex) => (
              <WorkoutExerciseCard key={exercise._id} exercise={exercise} exerciseIndex={exerciseIndex} />
            ))}

            <Button
              title="Добавить упражнение"
              icon={<Ionicons name="add" size={24} color={Colors.primary} />}
              callback={() => dispatch({ type: "SHOW_MODAL" })}
            />
          </View>
        </View>
      </ScrollView>

      <WorkoutExerciseModal />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 20,
  },
  sectionContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
  },
});
