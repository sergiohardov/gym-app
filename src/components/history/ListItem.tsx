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
  historyWorkout,
  onSwipeableWillOpen,
}: {
  historyWorkout: HistoryWorkout;
  onSwipeableWillOpen: (ref: SwipeableMethods) => void;
}) {
  const swipeableRef = useRef(null);
  const workoutDate = new Date(historyWorkout.createdAt);

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
          onPress={async () => await HistoryWorkoutsModel.remove(historyWorkout.id)}
        >
          <Ionicons name="trash" size={30} color={"red"} />
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity onPress={() => {}}>
        <Card style={styles.container}>
          <Text style={styles.title} numberOfLines={2}>
            {historyWorkout.name}
          </Text>
          <View style={styles.dateContainer}>
            <Text style={styles.timeText}>
              {workoutDate.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={styles.dateText}>
              {workoutDate.toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    lineHeight: 22,
  },
  dateContainer: {
    alignItems: "flex-end",
    gap: 6,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.surface,
  },
  dateText: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.8,
  },
});
