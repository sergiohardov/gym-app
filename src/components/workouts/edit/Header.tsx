import { Stack } from "expo-router";

export default function Header({ title }: { title: string }) {
  return (
    <Stack.Screen
      options={{
        title: title,
      }}
    />
  );
}
