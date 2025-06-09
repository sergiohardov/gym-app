import { View, Text, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/base/Input";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { exercises } from "db/schema";
import { db } from "db/client";

export default function ExerciseTabScreen() {
  const [searchInput, setSearchInput] = useState("");

  const { data } = useLiveQuery(db.select().from(exercises));

  const filteredData = data?.filter((item) =>
    item.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <View style={style.container}>
      <Input
        icon={<Ionicons name="search" size={20} color={Colors.surface} />}
        value={searchInput}
        setValue={setSearchInput}
      />

      <FlatList
        style={style.list}
        contentContainerStyle={style.content}
        data={filteredData}
        renderItem={({ item }) => (
          <View style={style.column}>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={style.notFound}>
            {searchInput ? "Не найдено." : "Нет данных."}
          </Text>
        )}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    gap: 16,
  },
  search: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 7,
    borderRadius: 5,
    gap: 7,
    borderColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    gap: 10,
  },
  column: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    flex: 1,
  },
  notFound: {
    textAlign: "center",
    color: Colors.secondary,
  },
});
