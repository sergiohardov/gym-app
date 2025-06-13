export const workoutSessionMock = {
  name: "Силовая тренировка",
  complete: false,
  exercises: [
    {
      id: 1,
      name: "Жим штанги лежа",
      complete: false,
      sets: [
        { id: 1, complete: false, weight: 60, reps: 10, rest: 5 },
        { id: 2, complete: false, weight: 70, reps: 8, rest: 10 },
        { id: 3, complete: false, weight: 80, reps: 6, rest: 90 },
      ],
    },
    {
      id: 2,
      name: "Приседания со штангой",
      complete: false,
      sets: [
        { id: 1, complete: false, weight: 70, reps: 10, rest: 60 },
        { id: 2, complete: false, weight: 90, reps: 8, rest: 60 },
        { id: 3, complete: false, weight: 100, reps: 6, rest: 90 },
      ],
    },
    {
      id: 3,
      name: "Тяга штанги в наклоне",
      complete: false,
      sets: [
        { id: 1, complete: false, weight: 50, reps: 10, rest: 60 },
        { id: 2, complete: false, weight: 60, reps: 8, rest: 60 },
        { id: 3, complete: false, weight: 70, reps: 6, rest: 90 },
      ],
    },
  ],
};
