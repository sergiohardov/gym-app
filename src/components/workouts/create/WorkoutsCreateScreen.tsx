import { View, Text, StyleSheet, ScrollView, Platform, Keyboard } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutsCreateContext } from "@/contexts/WorkoutsCreateContext";
import Button from "@/components/base/Button";
import WorkoutExerciseCard from "@/components/workouts/create/WorkoutsCreateExerciseCard";
import Header from "./Header";
import Input from "@/components/base/Input";
import WorkoutsCreateExercisesBottomSheet from "@/components/workouts/create/WorkoutsCreateExercisesBottomSheet";
import WorkoutsCreateAddExerciseBottomSheet from "./WorkoutsCreateAddExerciseBottomSheet";
import { useHeaderHeight } from "@react-navigation/elements";

export default function WorkoutsCreateScreen() {
  const { state, dispatch } = useWorkoutsCreateContext();
  const headerHeight = useHeaderHeight();

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={[styles.scrollView, { paddingTop: headerHeight }]}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Создание тренировки</Text>
          <Text style={styles.headerSubtitle}>Настройте упражнения и подходы для эффективной тренировки</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="pencil" size={20} color={Colors.primary} />
              </View>

              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitleText}>Название тренировки</Text>
              </View>
            </View>

            <Input
              placeholder="Например: Тренировка груди и трицепса"
              value={state.name}
              setValue={(value) => dispatch({ type: "SET_NAME", payload: value })}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="barbell" size={20} color={Colors.primary} />
              </View>

              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitleText}>Упражнения</Text>

                <View style={styles.sectionTitleBadge}>
                  <Text style={styles.sectionTitleBadgeText}>{state.exercises.length}</Text>
                </View>
              </View>
            </View>

            {state.exercises.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="fitness-outline" size={48} color={Colors.surface} />
                <Text style={styles.emptyTitle}>Упражнения не добавлены</Text>
                <Text style={styles.emptySubtitle}>Добавьте первое упражнение, чтобы начать создание тренировки</Text>
              </View>
            ) : (
              <View style={styles.exercisesContainer}>
                {state.exercises.map((exercise, exerciseIndex) => (
                  <WorkoutExerciseCard key={exercise._id} exercise={exercise} exerciseIndex={exerciseIndex} />
                ))}
              </View>
            )}

            <Button
              title="Добавить упражнение"
              icon={<Ionicons name="add" size={20} color={Colors.primary} />}
              callback={() => {
                Keyboard.dismiss();
                dispatch({ type: "SHOW_MODAL" });
              }}
            />
          </View>
        </View>
      </ScrollView>

      <WorkoutsCreateExercisesBottomSheet />
      <WorkoutsCreateAddExerciseBottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 20,
    flexGrow: 1,
  },
  headerContainer: {
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.secondary,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.surface,
    textAlign: "center",
  },
  contentContainer: {
    gap: 20,
  },
  sectionCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: "#aeaeae",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    flex: 1,
  },
  sectionTitleBadge: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  sectionTitleBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.surface,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.surface,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  exercisesContainer: {
    gap: 16,
  },
});
