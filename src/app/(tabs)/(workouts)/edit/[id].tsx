import WorkoutsEditorScreen from "@/components/workouts/editor/EditorScreen";
import { WorkoutsEditorProvider } from "@/contexts/WorkoutsEditorContext";

export default function WorkoutsEditScreen() {
  return (
    <WorkoutsEditorProvider>
      <WorkoutsEditorScreen />
    </WorkoutsEditorProvider>
  );
}
