import { create } from 'zustand';

export const usePersonalize = create((set) => ({
  profile: {
    ageGroup: null,
    gradeLevel: null,
    learningNeed: null,
    font: null,
    background: null,
    reducedMotion: false,
  },
  setProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch }})),
}));
