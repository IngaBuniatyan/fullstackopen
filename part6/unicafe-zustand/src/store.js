import { create } from 'zustand'

export const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    addGood: () => set((state) => ({ good: state.good + 1 })),
    addNeutral: () =>
      set((state) => ({ neutral: state.neutral + 1 })),
    addBad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}))
