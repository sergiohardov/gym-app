import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "@/components/base/Card";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";

export default function WorkoutsHistoryScreen() {
  const { data }: { data: any } = useLiveQuery(
    db.query.historyWorkouts.findMany({
      with: {
        exercises: {
          with: {
            sets: {},
          },
        },
      },
    })
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }: { item: any; index: number }) => (
          <TouchableOpacity activeOpacity={0.7}>
            <Card style={styles.historyCardContainer}>
              <View style={styles.cardHeaderContainer}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.cardDateContainer}>
                    <Text style={styles.cardDate}>{item?.createdAt.split(" ")[0]}</Text>
                    <Text style={styles.cardTime}>{item?.createdAt.split(" ")[1]}</Text>
                  </View>
                </View>

                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{index + 1}</Text>
                </View>
              </View>

              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="time" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Время</Text>
                  <Text style={styles.statValue}>{item.duration}c</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="barbell" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Упражнения</Text>
                  <Text style={styles.statValue}>{item.exercises.length}</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="fitness" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Подходы</Text>
                  <Text style={styles.statValue}>?</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="trending-up" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Общий вес</Text>
                  <Text style={styles.statValue}>? кг</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={64} color={Colors.surface} />
            <Text style={styles.emptyTitle}>История пуста</Text>
            <Text style={styles.emptySubtitle}>Завершите первую тренировку, чтобы увидеть её здесь</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: Colors.secondary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.surface,
  },
  filterButtonTextActive: {
    color: Colors.primary,
  },
  listContainer: {
    gap: 16,
  },
  historyCardContainer: {
    gap: 16,
  },
  cardHeaderContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTitleContainer: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    lineHeight: 22,
  },
  cardDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.surface,
  },
  cardTime: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.8,
  },
  cardBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  cardStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    color: Colors.surface,
    textAlign: "center",
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.secondary,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.surface,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.surface,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
