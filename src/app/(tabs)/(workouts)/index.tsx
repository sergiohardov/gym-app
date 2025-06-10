import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";
import { Ionicons } from "@expo/vector-icons";
import { removeWorkout } from "db/queries";

export default function WorkoutsTabScreen() {
  const { data } = useLiveQuery(db.query.workouts.findMany());

  return (
    <View style={styles.container}>
      {data.length ? (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={data}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.title}</Text>
              <TouchableOpacity onPress={async () => await removeWorkout(item.id)}>
                <Ionicons name="close" size={20} color={"red"} />
              </TouchableOpacity>
            </View>
          )}
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
