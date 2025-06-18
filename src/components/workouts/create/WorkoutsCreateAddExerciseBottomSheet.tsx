import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useWorkoutsCreateContext } from "@/contexts/WorkoutsCreateContext";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import { ExercisesModel } from "db/models/exercises";

export default function WorkoutsCreateAddExerciseBottomSheet() {
  const { state, dispatch, refetchExercises } = useWorkoutsCreateContext();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = ["40%"];

  const handleClose = useCallback(() => {
    dispatch({ type: "HIDE_CREATE_EXERCISE_MODAL" });
    setTitle("");
    bottomSheetModalRef.current?.dismiss();
  }, [dispatch]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleCreateExercise = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert("Ошибка", "Название упражнения не может быть пустым");
      return;
    }

    setIsLoading(true);
    try {
      const [response] = await ExercisesModel.create({ name: title.trim() });

      if (response.id) {
        // Обновляем список упражнений в контексте
        await refetchExercises();

        Alert.alert("Успех", "Упражнение успешно создано", [
          {
            text: "OK",
            onPress: () => {
              setTitle("");
              dispatch({ type: "HIDE_CREATE_EXERCISE_MODAL" });
            },
          },
        ]);
      } else {
        throw new Error("UNKNOWN");
      }
    } catch (error: any) {
      console.log(error);
      if (error.message?.includes("UNIQUE constraint failed")) {
        Alert.alert("Ошибка", "Упражнение с таким названием уже существует");
      } else if (error.message?.includes("UNKNOWN")) {
        Alert.alert("Ошибка", "Произошла ошибка при создании упражнения");
      } else {
        Alert.alert("Ошибка", "Неизвестная ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  }, [title, dispatch, refetchExercises]);

  useEffect(() => {
    if (state.createExerciseModalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [state.createExerciseModalVisible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} onPress={handleClose} />
    ),
    [handleClose]
  );

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
      <BottomSheetView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="add-circle" size={24} color={Colors.primary} />
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleText}>Создать упражнение</Text>
            <Text style={styles.headerSubtitleText}>Добавьте новое упражнение в базу данных</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Название упражнения</Text>
            <Input placeholder="Например: Жим штанги лежа" value={title} setValue={setTitle} />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose} disabled={isLoading}>
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>

            <Button
              title={isLoading ? "Создание..." : "Создать"}
              callback={handleCreateExercise}
              disabled={isLoading || !title.trim()}
              style={[styles.createButton, (!title.trim() || isLoading) && styles.disabledButton]}
            />
          </View>
        </View>
      </BottomSheetView>
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    gap: 12,
    marginBottom: 20,
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
  contentContainer: {
    flex: 1,
    gap: 24,
  },
  inputContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.surface,
  },
  createButton: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
