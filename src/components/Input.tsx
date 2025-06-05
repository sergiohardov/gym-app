import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { Component, ReactElement, SetStateAction } from "react";
import { Colors } from "@/constants/Colors";

type InputProps = {
  icon?: React.ReactNode;
  autofocus?: boolean;
  value: string;
  setValue: (text: string) => void;
};

export default function Input({
  icon = null,
  autofocus = false,
  value,
  setValue,
}: InputProps) {
  return (
    <View style={style.inputContainer}>
      {icon}
      <TextInput
        style={style.inputField}
        value={value}
        onChangeText={setValue}
        autoFocus={autofocus}
      />
    </View>
  );
}

const style = StyleSheet.create({
  inputContainer: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 5,
    gap: 8,
    borderColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputField: {
    flex: 1,
  },
});
