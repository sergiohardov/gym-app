import { View, Text, FlatList, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";

export default function WorkoutsTabScreen() {
  const { data } = useLiveQuery(db.query.workouts.findMany());

  return (
    <View style={styles.container}>
      {data.length ? (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={data}
          renderItem={({item}) => <Text>{item.title}</Text>}
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
    padding: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 15,
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
