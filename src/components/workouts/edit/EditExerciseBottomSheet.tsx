import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { TemplateExercisesModel } from "db/models/template-exercises";
import { TemplateSetsModel } from "db/models/template-sets";
import { Colors } from "@/constants/Colors";
import { Exercise, TemplateExercise, TemplateSet } from "@/types/db";
import { useWorkoutsEditStore } from "@/stores/WorkoutsEditStore";
import SetListItem from "@/components/workouts/edit/SetListItem";
import LoadingScreen from "@/components/base/LoadingScreen";

type TemplateExerciseWithSets = TemplateExercise & { exercise: Exercise; sets: TemplateSet[] };

export default function EditExerciseBottomSheet() {
  const {
    workout,
    refreshWorkout,
    setIsEditModalVisible,
    setCurrentExerciseId,
    currentExerciseId,
    isEditModalVisible,
  } = useWorkoutsEditStore();

  if (!workout) return null;

  const [exercise, setExercise] = useState<TemplateExerciseWithSets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const sheetModalRef = useRef<BottomSheetModal>(null);

  const fetchExercise = async (id: TemplateExercise["id"]) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await TemplateExercisesModel.getExerciseWithSets(id);
      if (!response?.id) throw Error;
      setExercise(response);
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при получении информации об упражнении");
      console.log(error);
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshExercise = async (id: TemplateExercise["id"]) => {
    if (refreshing) return;

    try {
      setRefreshing(true);
      const response = await TemplateExercisesModel.getExerciseWithSets(id);
      if (!response?.id) throw Error;
      setExercise(response);
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при получении информации об упражнении");
      console.log(error);
      handleClose();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRemove = async (id: TemplateExercise["id"]) => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const [response] = await TemplateExercisesModel.remove(id);
      if (!response.id) throw Error;
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при удалении упражнения");
      console.log(error);
    } finally {
      handleClose();
      setIsDeleting(false);
      refreshWorkout(workout.id);
    }
  };

  const handleAddSet = async (id: TemplateExercise["id"]) => {
    if (isCreating) return;

    try {
      setIsCreating(true);

      const [response] = await TemplateSetsModel.create({
        weight: 0,
        reps: 0,
        rest: 0,
        order: 0,
        templateExerciseId: id,
      });

      if (!response.id) throw Error;
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при добавлении сета");
      console.log(error);
    } finally {
      refreshWorkout(workout.id);
      refreshExercise(id);
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setIsEditModalVisible(false);
    setExercise(null);
    setCurrentExerciseId(null);
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      handleClose();
    }
  }, []);

  useEffect(() => {
    if (currentExerciseId) {
      fetchExercise(currentExerciseId);
    }
  }, [currentExerciseId]);

  useEffect(() => {
    if (isEditModalVisible) {
      sheetModalRef.current?.present();
    } else {
      sheetModalRef.current?.dismiss();
    }
  }, [isEditModalVisible]);

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
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {isLoading ? "Загрузка..." : exercise?.exercise.name ?? "Упражнение"}
            </Text>
            <Text style={styles.headerSubtitle}>Добавьте подходы</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (currentExerciseId) {
                handleRemove(currentExerciseId);
              }
            }}
          >
            <Ionicons name="trash" size={30} color="red" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ height: 400 }}>
            <LoadingScreen text="Загрузка" />
          </View>
        ) : (
          <BottomSheetFlatList
            style={styles.listStyle}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={() => {
              if (currentExerciseId) {
                refreshExercise(currentExerciseId);
              }
            }}
            data={exercise?.sets ?? []}
            renderItem={({ item, index }) =>
              currentExerciseId ? <SetListItem item={item} index={index} refreshExercise={refreshExercise} /> : <></>
            }
            ListFooterComponent={() => (
              <TouchableOpacity
                style={styles.listFooterItemContainer}
                onPress={() => {
                  if (currentExerciseId) {
                    handleAddSet(currentExerciseId);
                  }
                }}
              >
                <View style={styles.listFooterItemIcon}>
                  <Ionicons name="add" size={30} color={Colors.secondary} />
                </View>
                <Text style={styles.listFooterItemText}>Добавить подход</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    height: "100%",
    paddingHorizontal: 16,
    gap: 20,
  },
  headerContainer: {
    flexDirection: "row",
  },
  headerTextContainer: {
    gap: 5,
    flex: 1,
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
  listStyle: {
    flex: 1,
  },
  listContainer: {
    gap: 10,
    paddingBottom: 50,
  },
  listFooterItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listFooterItemIcon: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 50,
    padding: 6,
  },
  listFooterItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
