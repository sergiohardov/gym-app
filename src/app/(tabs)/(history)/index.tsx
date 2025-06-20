import { View, StyleSheet, FlatList } from "react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";
import ListItem from "@/components/history/ListItem";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import { useRef } from "react";
import EmptyScreen from "@/components/base/EmptyScreen";
import { HistoryWorkout } from "@/types/db";

export default function HistoryTabScreen() {
  const { data }: { data: HistoryWorkout[] } = useLiveQuery(db.query.historyWorkouts.findMany());
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
          data={data}
          // contentContainerStyle={styles.listContainer}
          renderItem={({ item }: { item: HistoryWorkout }) => (
            <ListItem historyWorkout={item} onSwipeableWillOpen={handleSwipeableOpen} />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => {
            if (openedSwipeableRef.current) {
              openedSwipeableRef.current.close();
              openedSwipeableRef.current = null;
            }
          }}
        />
      ) : (
        <EmptyScreen
          icon="document-text-outline"
          title="История пуста"
          subtitle="Завершите первую тренировку, чтобы увидеть её здесь"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    gap: 16,
    padding: 16,
  },
});
