import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useWorkoutsEditorContext } from "@/contexts/WorkoutsEditorContext";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Exercise } from "@/types/db";
import Button from "@/components/base/Button";
import InputBottomSheet from "@/components/base/InputBottomSheet";

export default function ExercisesBottomSheet() {
  const { state, dispatch, exercises } = useWorkoutsEditorContext();
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const snapPoints = ["60%", "85%"];

  const handleSelectExercise = useCallback(
    (exercise: Exercise) => {
      dispatch({
        type: "ADD_EXERCISE",
        payload: exercise,
      });
      handleClose();
    },
    [dispatch]
  );

  const handleClose = useCallback(() => {
    dispatch({ type: "HIDE_EXERCISE_LIST_MODAL" });
    setSearchQuery("");
    bottomSheetModalRef.current?.dismiss();
  }, [dispatch]);

  const handleCreateExercise = useCallback(() => {
    dispatch({ type: "SHOW_EXERCISE_CREATE_MODAL" });
  }, [dispatch]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        dispatch({ type: "HIDE_EXERCISE_LIST_MODAL" });
        setSearchQuery("");
      }
    },
    [dispatch]
  );

  // Используем useEffect для открытия/закрытия модального окна
  useEffect(() => {
    if (state.modalExerciseListVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [state.modalExerciseListVisible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} onPress={handleClose} />
    ),
    [handleClose]
  );

  const renderListItem = useCallback(
    ({ item, index }: { item: Exercise; index: number }) => (
      <TouchableOpacity
        style={[styles.listOption, index === filteredExercises.length - 1 && styles.lastItem]}
        onPress={() => handleSelectExercise(item)}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseInfo}>
          <View style={styles.exerciseIconContainer}>
            <Ionicons name="fitness" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.listOptionText}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.secondary} />
      </TouchableOpacity>
    ),
    [filteredExercises.length, handleSelectExercise]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Ionicons name="search" size={48} color={Colors.surface} />
        <Text style={styles.emptyStateTitle}>Упражнения не найдены</Text>
        <Text style={styles.emptyStateText}>
          {searchQuery ? `Попробуйте изменить поисковый запрос "${searchQuery}"` : "Список упражнений пуст"}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  const renderItemSeparator = useCallback(() => <View style={styles.separator} />, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetIndicator}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="barbell" size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleText}>Выберите упражнение</Text>
          <Text style={styles.headerSubtitleText}>
            {filteredExercises.length} из {exercises.length} упражнений
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <InputBottomSheet
          style={{ flex: 2 }}
          icon={<Ionicons name="search" size={18} color={Colors.surface} />}
          placeholder="Поиск упражнений..."
          value={searchQuery}
          setValue={setSearchQuery}
        />

        <Button title="+ Создать" callback={handleCreateExercise} style={{ paddingVertical: 9 }} />
      </View>

      <BottomSheetFlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderListItem}
        ItemSeparatorComponent={renderItemSeparator}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        style={styles.listStyle}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: Colors.secondary,
    width: 40,
    height: 4,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    gap: 12,
    backgroundColor: Colors.primary,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    gap: 2,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  headerSubtitleText: {
    fontSize: 14,
    color: Colors.surface,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listStyle: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  listOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
  lastItem: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  exerciseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  listOptionText: {
    fontSize: 16,
    color: Colors.secondary,
    flex: 1,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.surface,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 16,
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.surface,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.surface,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
