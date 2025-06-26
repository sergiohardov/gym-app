import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Keyboard, Alert, ActivityIndicator } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TemplateWorkoutsModel } from "db/models/template-workouts";

// TODO: при закрытии если активно добавление тренировки в бд, нужно прервать его
// TODO: ошибочно добавляются тренировки с одинаковым названием

export default function CreateBottomSheetModal({
  isBottomSheetVisible,
  setIsBottomSheetVisible,
}: {
  isBottomSheetVisible: boolean;
  setIsBottomSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setTitle("");
      setIsBottomSheetVisible(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setTitle("");
    setIsBottomSheetVisible(false);
    sheetModalRef.current?.dismiss();
    Keyboard.dismiss();
  }, []);

  const handleApply = async () => {
    if (!title.trim()) return false;

    try {
      setIsLoading(true);

      const [workout] = await TemplateWorkoutsModel.create({ name: title });
      if (!workout.id) throw Error;

      Alert.alert("Успех", `Тренировка "${title}" создана!`);
      handleClose();
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при создании тренировки.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isBottomSheetVisible) {
      sheetModalRef.current?.present();
    } else {
      sheetModalRef.current?.dismiss();
    }
  }, [isBottomSheetVisible]);

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
          <Text style={styles.headerSubtitle}>Введите название для тренировки</Text>
        </View>

        <BottomSheetTextInput
          style={styles.input}
          placeholder="Например: Грудные"
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
                <Text style={styles.continueButtonText}>Продолжить</Text>
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
