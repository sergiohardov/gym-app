import WorkoutsEditorScreen from "@/components/workouts/editor/EditorScreen";
import { WorkoutsEditorProvider } from "@/contexts/WorkoutsEditorContext";

export default function WorkoutsCreateScreen() {
  return (
    <WorkoutsEditorProvider>
      <WorkoutsEditorScreen />
    </WorkoutsEditorProvider>
  );
}
