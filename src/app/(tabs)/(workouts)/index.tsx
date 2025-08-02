import { View, FlatList, StyleSheet, Alert, Button } from "react-native";
import { useEffect, useRef, useState } from "react";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import * as Haptics from "expo-haptics";

import { FullTemplateWorkout } from "@/types/db";
import PreviewListItem from "@/components/workouts/index/PreviewListItem";
import EmptyScreen from "@/components/base/EmptyScreen";
import CreateBottomSheet from "@/components/workouts/index/CreateBottomSheet";
import Header from "@/components/workouts/index/Header";
import LoadingScreen from "@/components/base/LoadingScreen";

export default function WorkoutsTabScreen() {
  const [workouts, setWorkouts] = useState<FullTemplateWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false);
  const openedSwipeableRef = useRef<SwipeableMethods | null>(null);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      const data = await TemplateWorkoutsModel.getAllFull();
      setWorkouts(data);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ошибка", "Ошибка при получении списка тренировок.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWorkouts = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      setRefreshing(true);
      const data = await TemplateWorkoutsModel.getAllFull();
      setWorkouts(data);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ошибка", "Ошибка при получении списка тренировок.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSwipeableOpen = (ref: SwipeableMethods) => {
    if (openedSwipeableRef.current && openedSwipeableRef.current !== ref) {
      openedSwipeableRef.current.close();
    }

    openedSwipeableRef.current = ref;
  };

  const handleRefresh = () => {
    refreshWorkouts();
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  if (isLoading) {
    return <LoadingScreen text="Загрузка списка тренировок..." />;
  }

  return (
    <>
      <Header setIsBottomSheetVisible={setIsBottomSheetVisible} />

      <View style={styles.container}>
        {workouts.length ? (
          <FlatList
            style={styles.listContainer}
            contentContainerStyle={styles.listContentContainer}
            data={workouts}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => (
              <PreviewListItem
                workoutId={item.id}
                workoutName={item.name}
                exercisesCount={item.templateExercises.length}
                onSwipeableWillOpen={handleSwipeableOpen}
                handleRefresh={handleRefresh}
              />
            )}
            onScrollBeginDrag={() => {
              if (openedSwipeableRef.current) {
                openedSwipeableRef.current.close();
                openedSwipeableRef.current = null;
              }
            }}
          />
        ) : (
          <EmptyScreen
            icon="barbell-outline"
            title="Тренировок не создано"
            subtitle="Создайте свою первую тренировку."
          />
        )}
      </View>

      <CreateBottomSheet
        isBottomSheetVisible={isBottomSheetVisible}
        setIsBottomSheetVisible={setIsBottomSheetVisible}
        handleRefresh={handleRefresh}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingVertical: 16,
    gap: 16,
  },
});
