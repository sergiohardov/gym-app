import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function TabsLayout() {
  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: Colors.secondary,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Главная",
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(workouts)"
          options={{
            title: "Тренировки",
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons name={focused ? "barbell" : "barbell-outline"} size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(history)"
          options={{
            title: "История",
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons name={focused ? "document-text" : "document-text-outline"} size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Профиль",
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
