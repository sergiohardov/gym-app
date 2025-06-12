import { useWorkoutsSessionReducer } from "@/reducers/WorkoutsSessionReducer";
import { WorkoutsSessionContextProps } from "@/types/workouts";
import { createContext, ReactNode, useContext } from "react";

const Context = createContext<WorkoutsSessionContextProps | undefined>(undefined);

export const WorkoutsSessionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useWorkoutsSessionReducer();

  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
};

export const useWorkoutsSessionContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useWorkoutsSessionContext must be used within an WorkoutsSessionProvider");

  return context;
};
