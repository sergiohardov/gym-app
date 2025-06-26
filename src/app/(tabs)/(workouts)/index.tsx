import { View, FlatList, StyleSheet } from "react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";
import PreviewListItem from "@/components/workouts/index/PreviewListItem";
import { useRef, useState } from "react";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import EmptyScreen from "@/components/base/EmptyScreen";
import CreateBottomSheet from "@/components/workouts/index/CreateBottomSheet";
import Header from "@/components/workouts/index/Header";

export default function WorkoutsTabScreen() {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false);
  const openedSwipeableRef = useRef<SwipeableMethods | null>(null);

  // TODO: задать типы
  const { data } = useLiveQuery(
    db.query.templateWorkouts.findMany({
      with: {
        templateExercises: {},
      },
    })
  );

  const handleSwipeableOpen = (ref: SwipeableMethods) => {
    if (openedSwipeableRef.current && openedSwipeableRef.current !== ref) {
      openedSwipeableRef.current.close();
    }

    openedSwipeableRef.current = ref;
  };

  return (
    <>
      <Header setIsBottomSheetVisible={setIsBottomSheetVisible} />

      <View style={styles.container}>
        {data.length ? (
          <FlatList
            style={styles.listContainer}
            contentContainerStyle={styles.listContentContainer}
            data={data}
            renderItem={({ item }) => (
              <PreviewListItem
                workoutId={item.id}
                workoutName={item.name}
                exercisesCount={item.templateExercises.length}
                onSwipeableWillOpen={handleSwipeableOpen}
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
    paddingVertical: 16,
  },
  listContentContainer: {
    gap: 16,
  },
});
