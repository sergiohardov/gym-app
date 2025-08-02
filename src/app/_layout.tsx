import "react-native-get-random-values";
import { db, expo_sqlite } from "db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "drizzle/migrations";
import { router, Slot } from "expo-router";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

const InitialLayout = () => {
  const { settings, isLoading } = useAppSettings();

  useEffect(() => {
    // Ждем завершения загрузки настроек
    if (isLoading) return;

    if (settings.isFirstLaunch) {
      router.replace("/welcome");
    } else {
      router.replace("/(tabs)/home");
    }
  }, [settings, isLoading]);

  // Показываем индикатор загрузки пока настройки не загружены
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (__DEV__) {
    useDrizzleStudio(expo_sqlite);
  }

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!success) return null;

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <GestureHandlerRootView>
        <InitialLayout />
      </GestureHandlerRootView>
    </Suspense>
  );
}
