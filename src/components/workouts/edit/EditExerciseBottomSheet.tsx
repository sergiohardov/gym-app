import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { Exercise, TemplateExercise, TemplateSet } from "@/types/db";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import SetListItem from "./SetListItem";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";
import { eq } from "drizzle-orm";
import { templateExercises, templateSets } from "db/schema";
import { router } from "expo-router";
import { ExercisesModel } from "db/models/exercises";
import { TemplateSetsModel } from "db/models/template-sets";

type EditExerciseBottomSheetProps = {
  currentExerciseId: TemplateExercise["id"] | null;
  isEditModalVisible: boolean;
  setCurrentExerciseId: React.Dispatch<React.SetStateAction<TemplateExercise["id"] | null>>;
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function EditExerciseBottomSheet({
  currentExerciseId,
  isEditModalVisible,
  setIsEditModalVisible,
  setCurrentExerciseId,
}: EditExerciseBottomSheetProps) {
  const [title, setTitle] = useState<string>("Упражнение");
  const sheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setCurrentExerciseId(null);
      setIsEditModalVisible(false);
    }
  }, []);

  const handleClose = () => {
    setCurrentExerciseId(null);
    setIsEditModalVisible(false);
  };

  const handleRemove = async () => {
    try {
      if (!currentExerciseId) throw Error;

      const [exercise] = await TemplateWorkoutsModel.removeExercise(currentExerciseId);
      if (!exercise.id) throw Error;

      handleClose();
      Alert.alert("Успех", "Упражнение было удалено");
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при удалении упражнения");
      console.log(error);
    }
  };

  const handleAddSet = async () => {
    try {
      const [set] = await TemplateSetsModel.create({
        weight: 0,
        reps: 0,
        rest: 0,
        order: 0,
        templateExerciseId: currentExerciseId,
      });

      if (!set.id) throw Error;
      Alert.alert("Успех", "Сет добавлен");
    } catch (error) {
      Alert.alert("Ошибка", "Ошибка при добавлении сета к упражнение");
      console.log(error);
    }
  };

  const { data, error } = useLiveQuery(
    db.query.templateSets.findMany({ where: eq(templateSets.templateExerciseId, currentExerciseId) }),
    [currentExerciseId]
  );

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
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>Добавьте подходы</Text>
          </View>

          <TouchableOpacity onPress={handleRemove}>
            <Ionicons name="trash" size={30} color="red" />
          </TouchableOpacity>
        </View>

        <BottomSheetFlatList
          style={styles.listStyle}
          contentContainerStyle={styles.listContainer}
          data={data}
          renderItem={({ item, index }) => <SetListItem item={item} index={index} />}
          ListFooterComponent={() => (
            <TouchableOpacity style={styles.listFooterItemContainer} onPress={handleAddSet}>
              <View style={styles.listFooterItemIcon}>
                <Ionicons name="add" size={30} color={Colors.secondary} />
              </View>
              <Text style={styles.listFooterItemText}>Добавить подход</Text>
            </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,
    gap: 10,
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
