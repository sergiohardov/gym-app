import 'react-native-get-random-values';
import { db, expo_sqlite } from "db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "drizzle/migrations";
import { Slot } from "expo-router";
import { useSQLiteDevTools } from "expo-sqlite-devtools";
import { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (__DEV__) {
    // useDrizzleStudio(expo_sqlite);
    useSQLiteDevTools(expo_sqlite);
  }

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!success) return null;

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <Slot />
    </Suspense>
  );
}
