import { useCallback } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";

export const useWorkoutSession = () => {
  const { status, saveWorkoutSession, forceCompleteAndSave, resetStore } = useWorkoutsSessionStore();

  const handleWorkoutComplete = useCallback(async () => {
    const result = await saveWorkoutSession();

    if (result.success) {
      Alert.alert("Тренировка завершена! 🎉", result.message, [
        {
          text: "К списку тренировок",
          onPress: () => {
            resetStore();
            router.replace("/(tabs)/(workouts)");
          },
        },
        {
          text: "К истории",
          onPress: () => {
            resetStore();
            router.replace("/(tabs)/history");
          },
        },
      ]);
    } else {
      Alert.alert("Ошибка сохранения", result.error || "Не удалось сохранить тренировку", [
        {
          text: "Повторить",
          onPress: handleWorkoutComplete,
        },
        {
          text: "Отмена",
          style: "cancel",
        },
      ]);
    }
  }, [saveWorkoutSession, resetStore]);

  const handleForceFinish = useCallback(() => {
    Alert.alert(
      "Завершить тренировку?",
      "Тренировка будет сохранена в текущем состоянии. Все выполненные упражнения и подходы будут записаны в историю.",
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Завершить",
          style: "destructive",
          onPress: async () => {
            const result = await forceCompleteAndSave();

            if (result.success) {
              Alert.alert("Тренировка сохранена ✅", result.message, [
                {
                  text: "К списку тренировок",
                  onPress: () => {
                    resetStore();
                    router.replace("/(tabs)/(workouts)");
                  },
                },
                {
                  text: "К истории",
                  onPress: () => {
                    resetStore();
                    router.replace("/(tabs)/history");
                  },
                },
              ]);
            } else {
              Alert.alert("Ошибка сохранения", result.error || "Не удалось сохранить тренировку", [
                {
                  text: "Повторить",
                  onPress: handleForceFinish,
                },
                {
                  text: "Отмена",
                  style: "cancel",
                },
              ]);
            }
          },
        },
      ]
    );
  }, [forceCompleteAndSave, resetStore]);

  const handleBackPress = useCallback(() => {
    if (status === "start") {
      // Если тренировка не начата, просто выходим
      resetStore();
      router.back();
      return;
    }

    // Если тренировка в процессе, показываем предупреждение
    Alert.alert("Завершить тренировку?", "Вы можете сохранить текущий прогресс или выйти без сохранения.", [
      {
        text: "Отмена",
        style: "cancel",
      },
      {
        text: "Выйти без сохранения",
        style: "destructive",
        onPress: () => {
          resetStore();
          router.back();
        },
      },
      {
        text: "Сохранить и выйти",
        onPress: async () => {
          const result = await forceCompleteAndSave();
          if (result.success) {
            resetStore();
            router.back();
          } else {
            Alert.alert("Ошибка сохранения", result.error || "Не удалось сохранить тренировку", [
              {
                text: "Повторить",
                onPress: async () => {
                  const retryResult = await forceCompleteAndSave();
                  if (retryResult.success) {
                    resetStore();
                    router.back();
                  }
                },
              },
              {
                text: "Выйти без сохранения",
                style: "destructive",
                onPress: () => {
                  resetStore();
                  router.back();
                },
              },
            ]);
          }
        },
      },
    ]);
  }, [status, resetStore, forceCompleteAndSave]);

  return {
    handleWorkoutComplete,
    handleForceFinish,
    handleBackPress,
    canExit: status === "start",
  };
};
