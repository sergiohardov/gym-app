import { View, StyleSheet, TextInput, KeyboardTypeOptions, StyleProp, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { Colors } from "@/constants/Colors";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

type InputProps = {
  icon?: ReactNode;
  placeholder?: string;
  autofocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  value: string;
  setValue: (text: string) => void;
};

export default function InputBottomSheet({
  icon = null,
  placeholder = "",
  autofocus = false,
  keyboardType = "default",
  style = {},
  value,
  setValue,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {icon}
      <BottomSheetTextInput
        style={styles.field}
        value={value}
        onChangeText={setValue}
        autoFocus={autofocus}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={Colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 5,
    gap: 8,
    borderColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
  },
  field: {
    flex: 1,
  },
});
