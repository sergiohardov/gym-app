import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { formatTime } from "@/utils/format";

export default function Header() {
  const { status, durationTime, incrementDurationTime } = useWorkoutsSessionStore();
  const durationTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        headerTitle: () => (
          <View style={styles.container}>
            <Text style={styles.text}>Тренировка</Text>
            {status !== "start" && <Text>{formatTime(durationTime)}</Text>}
          </View>
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
});
