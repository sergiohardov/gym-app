import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Card from "@/components/base/Card";

// Моковые данные для демонстрации
const mockHistoryData = [
  {
    id: 1,
    name: "Тренировка груди и трицепса",
    date: "2024-06-18T18:30:00Z",
    duration: 3600, // в секундах
    exercisesCount: 5,
    setsCount: 15,
    totalWeight: 2450,
  },
  {
    id: 2,
    name: "Тренировка спины и бицепса",
    date: "2024-06-16T10:15:00Z",
    duration: 4200,
    exercisesCount: 6,
    setsCount: 18,
    totalWeight: 2890,
  },
  {
    id: 3,
    name: "Тренировка ног",
    date: "2024-06-14T16:45:00Z",
    duration: 5400,
    exercisesCount: 4,
    setsCount: 16,
    totalWeight: 3200,
  },
  {
    id: 4,
    name: "Тренировка плеч",
    date: "2024-06-12T19:00:00Z",
    duration: 2700,
    exercisesCount: 4,
    setsCount: 12,
    totalWeight: 1680,
  },
  {
    id: 5,
    name: "Полная тренировка тела",
    date: "2024-06-10T08:30:00Z",
    duration: 6300,
    exercisesCount: 8,
    setsCount: 24,
    totalWeight: 4120,
  },
];

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  return `${minutes}м`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Сегодня";
  if (isYesterday) return "Вчера";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function WorkoutsHistoryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockHistoryData}
        renderItem={({ item, index }: { item: (typeof mockHistoryData)[number]; index: number }) => (
          <TouchableOpacity activeOpacity={0.7}>
            <Card style={styles.historyCardContainer}>
              <View style={styles.cardHeaderContainer}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.cardDateContainer}>
                    <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.cardTime}>{formatTime(item.date)}</Text>
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
                  <Text style={styles.statValue}>{formatDuration(item.duration)}</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="barbell" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Упражнения</Text>
                  <Text style={styles.statValue}>{item.exercisesCount}</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="fitness" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Подходы</Text>
                  <Text style={styles.statValue}>{item.setsCount}</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="trending-up" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.statLabel}>Общий вес</Text>
                  <Text style={styles.statValue}>{item.totalWeight} кг</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.viewButton}>
                  <Ionicons name="eye" size={16} color={Colors.secondary} />
                  <Text style={styles.viewButtonText}>Просмотр</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.repeatButton}>
                  <Ionicons name="refresh" size={16} color={Colors.primary} />
                  <Text style={styles.repeatButtonText}>Повторить</Text>
                </TouchableOpacity>
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
  cardFooter: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
    paddingTop: 12,
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.surface,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.secondary,
  },
  repeatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    gap: 6,
  },
  repeatButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
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
