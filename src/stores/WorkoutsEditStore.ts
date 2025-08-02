import { create } from "zustand";

import { TemplateWorkout } from "@/types/db";
import { WorkoutsEditStore } from "@/types/workouts";
import { TemplateWorkoutsModel } from "db/models/template-workouts";

export const useWorkoutsEditStore = create<WorkoutsEditStore>((set, get) => ({
  workout: null,
  currentExerciseId: null,
  isLoading: true,
  refreshing: false,
  isAddModalVisible: false,
  isCreateModalVisible: false,
  isEditModalVisible: false,

  loadWorkout: async (id: TemplateWorkout["id"]) => {
    try {
      const response = await TemplateWorkoutsModel.getFullById(id);
      if (!response) throw new Error();

      set({ workout: response });
    } catch (error) {
      set({ workout: null });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshWorkout: async (id: TemplateWorkout["id"]) => {
    try {
      set({ refreshing: true });
      const response = await TemplateWorkoutsModel.getFullById(id);
      if (!response) throw new Error();

      set({ workout: response });
    } catch (error) {
      set({ workout: null });
    } finally {
      set({ refreshing: false });
    }
  },

  setCurrentExerciseId: (id) => set({ currentExerciseId: id }),
  setIsAddModalVisible: (status) => set({ isAddModalVisible: status }),
  setIsCreateModalVisible: (status) => set({ isCreateModalVisible: status }),
  setIsEditModalVisible: (status) => set({ isEditModalVisible: status }),
}));
