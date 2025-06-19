import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";
import WorkoutPreviewListItem from "@/components/workouts/index/WorkoutPreviewListItem";
import { useRef } from "react";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import { TemplateWorkout } from "@/types/db";

export default function WorkoutsTabScreen() {
  const { data }: { data: TemplateWorkout[] } = useLiveQuery(db.query.templateWorkouts.findMany());

  const openedSwipeableRef = useRef<SwipeableMethods | null>(null);

  const handleSwipeableOpen = (ref: SwipeableMethods) => {
    if (openedSwipeableRef.current && openedSwipeableRef.current !== ref) {
      openedSwipeableRef.current.close();
    }

    openedSwipeableRef.current = ref;
  };

  return (
    <View style={styles.container}>
      {data.length ? (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={data}
          renderItem={({ item }) => (
            <WorkoutPreviewListItem workoutId={item.id} onSwipeableWillOpen={handleSwipeableOpen} />
          )}
          onScrollBeginDrag={() => {
            if (openedSwipeableRef.current) {
              openedSwipeableRef.current.close();
              openedSwipeableRef.current = null;
            }
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Список пуст.</Text>
          <Text style={styles.emptyText}>Создайте свою первую тренировку</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 16,
  },
  listItem: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  emptyText: {
    color: Colors.surface,
  },
});
