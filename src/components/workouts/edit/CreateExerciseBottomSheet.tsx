import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import { ExercisesModel } from "db/models/exercises";
import * as Haptics from "expo-haptics";

type CreateExerciseBottomSheetProps = {
  isCreateModalVisible: boolean;
  setIsCreateModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateExerciseBottomSheet({
  isCreateModalVisible,
  setIsCreateModalVisible,
  setIsAddModalVisible,
}: CreateExerciseBottomSheetProps) {
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      handleClose();
    }
  }, []);

  const handleClose = () => {
    setTitle("");
    setIsLoading(false);
    setIsCreateModalVisible(false);
    setIsAddModalVisible(true);
  };

  const handleApply = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    try {
      setIsLoading(true);
      const [exercise] = await ExercisesModel.create({ name: title });
      if (!exercise.id) throw Error;
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ошибка", "Ошибка при создании упражнения.");
      console.log(error);
    } finally {
      handleClose();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isCreateModalVisible) {
      sheetModalRef.current?.present();
    } else {
      sheetModalRef.current?.dismiss();
    }
  }, [isCreateModalVisible]);

  return (
    <BottomSheetModal
      ref={sheetModalRef}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} onPress={handleClose} />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Название</Text>
          <Text style={styles.headerSubtitle}>Введите название для упражнения</Text>
        </View>

        <BottomSheetTextInput
          style={styles.input}
          placeholder="Например: Жим лежа"
          value={title}
          onChangeText={setTitle}
          autoFocus={true}
        />

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
            onPress={handleApply}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Ionicons name="arrow-forward" color={Colors.primary} size={25} />
                <Text style={styles.continueButtonText}>Создать</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    paddingVertical: 8,
    fontSize: 16,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    paddingVertical: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20, // Учитываем safe area на iOS
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 50,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});
