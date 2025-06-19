import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useRef } from "react";
import Card from "../base/Card";
import { Ionicons } from "@expo/vector-icons";
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Colors } from "@/constants/Colors";
import { HistoryWorkoutsModel } from "db/models/history-workouts";
import { HistoryWorkout } from "@/types/db";

// TODO: разобраться со стилями (падинги списка и карточек)
export default function ListItem({
  item,
  index,
  historyWorkoutId,
  onSwipeableWillOpen,
}: {
  item: any;
  index: number;
  historyWorkoutId: HistoryWorkout["id"];
  onSwipeableWillOpen: (ref: SwipeableMethods) => void;
}) {
  const swipeableRef = useRef(null);

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      onSwipeableWillOpen={() => {
        if (swipeableRef.current) onSwipeableWillOpen(swipeableRef.current);
      }}
      renderRightActions={() => (
        <TouchableOpacity
          style={{
            marginRight: 16,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={async () => await HistoryWorkoutsModel.remove(historyWorkoutId)}
        >
          <Ionicons name="trash" size={30} color={"red"} />
        </TouchableOpacity>
      )}
    >
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
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
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
});
