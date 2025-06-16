import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useWorkoutsCreateContext } from "@/contexts/WorkoutsCreateContext";

export default function WorkoutsCreateExercisesModal() {
  const { state, dispatch, exercises } = useWorkoutsCreateContext();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={state.modalVisible}
      onRequestClose={() => dispatch({ type: "HIDE_MODAL" })}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Выберите упражнение</Text>
            <TouchableOpacity
              onPress={() => dispatch({ type: "HIDE_MODAL" })}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listOption}
                onPress={() => {
                  dispatch({
                    type: "ADD_EXERCISE",
                    payload: {
                      exerciseId: item.id,
                    },
                  });
                  dispatch({ type: "HIDE_MODAL" });
                }}
              >
                <Text style={styles.listOptionText}>{item.title}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.surface}
                />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  listOption: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listOptionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
