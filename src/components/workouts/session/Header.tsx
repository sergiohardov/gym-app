import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { formatTime } from "@/utils/format";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";

export default function Header() {
  const { workout, status, durationTime, incrementDurationTime } = useWorkoutsSessionStore();
  const { handleForceFinish } = useWorkoutSession();
  const durationTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isShowFinishButton = status !== "start" && status !== "end";

  const handleFinishWorkout = () => {
    handleForceFinish();
  };

  useEffect(() => {
    if (status === "playing") {
      durationTimeRef.current = setInterval(() => {
        incrementDurationTime();
      }, 1000);
    } else if (status === "pause") {
      if (durationTimeRef.current !== null) {
        clearInterval(durationTimeRef.current);
      }
    } else if (status === "end") {
      if (durationTimeRef.current !== null) {
        clearInterval(durationTimeRef.current);
      }
    }

    return () => {
      if (durationTimeRef.current !== null) {
        clearInterval(durationTimeRef.current);
      }
    };
  }, [status]);

  return (
    <Stack.Screen
      options={{
        headerTransparent: true,
        headerTitle: () => (
          <View style={styles.container}>
            <Text style={styles.text}>{workout.title}</Text>
            {status !== "start" && <Text>{formatTime(durationTime)}</Text>}
          </View>
        ),
        headerRight: () =>
          isShowFinishButton && (
            <TouchableOpacity onPress={handleFinishWorkout} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>Стоп</Text>
              <Ionicons name="stop" size={20} color={Colors.primary} />
            </TouchableOpacity>
          ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stopButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
