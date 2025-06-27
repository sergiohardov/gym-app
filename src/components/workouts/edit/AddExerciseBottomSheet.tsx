import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { Exercise, TemplateWorkout } from "@/types/db";
import { Ionicons } from "@expo/vector-icons";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";
import { TemplateExercisesModel } from "db/models/template-exercises";

type AddExerciseBottomSheetProps = {
  workoutId: TemplateWorkout["id"];
  isAddModalVisible: boolean;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreateModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddExerciseBottomSheet({
  workoutId,
  isAddModalVisible,
  setIsAddModalVisible,
  setIsCreateModalVisible,
}: AddExerciseBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sheetModalRef = useRef<BottomSheetModal>(null);

  const { data } = useLiveQuery(db.query.exercises.findMany());

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsAddModalVisible(false);
    }
  }, []);

  const handleClose = () => {
    setSearchQuery("");
    setIsAddModalVisible(false);
  };

  const handleAddExercise = async (id: Exercise["id"]) => {
    try {
      setIsLoading(true);

      const [response] = await TemplateExercisesModel.create({
        templateWorkoutId: workoutId,
        exerciseId: id,
        order: 0,
      });

      if (!response.id) throw Error;
      Alert.alert("Успех", "Упражнение добавлено");
      handleClose();
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при добавлении упражнения");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExercises = data.filter((exercise) => exercise.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    if (isAddModalVisible) {
      sheetModalRef.current?.present();
    } else {
      sheetModalRef.current?.dismiss();
    }
  }, [isAddModalVisible]);

  // TODO: При открытии клавиатуры высота модалки уходит за пределы snapPoints
  // TODO: Список не прокручивается последний элемент вываливатется за пределы низа
  return (
    <BottomSheetModal
      ref={sheetModalRef}
      snapPoints={["85%"]}
      enableDynamicSizing={false}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} onPress={handleClose} />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Упражнения</Text>
          <Text style={styles.headerSubtitle}>Выберите упражнение</Text>
        </View>

        <View style={styles.searchContainer}>
          <BottomSheetTextInput
            style={styles.input}
            placeholder="Поиск..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.createButton} onPress={() => setIsCreateModalVisible(true)}>
            <Ionicons name="arrow-forward" color={Colors.primary} size={25} />
            <Text style={styles.createButtonText}>Создать</Text>
          </TouchableOpacity>
        </View>

        <BottomSheetFlatList
          style={styles.listStyle}
          contentContainerStyle={styles.listContainer}
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={(item) => (
            <TouchableOpacity style={styles.listItemContainer} onPress={() => handleAddExercise(item.item.id)}>
              <Text style={styles.listItemTitle}>{item.item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.surface} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: Colors.secondary }} />
          )}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 20,
  },
  headerContainer: {
    gap: 5,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.surface,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  listStyle: {
    flex: 1,
  },
  listContainer: {},
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemTitle: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    paddingVertical: 8,
    fontSize: 16,
    flex: 1,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 50,
  },
  createButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});
