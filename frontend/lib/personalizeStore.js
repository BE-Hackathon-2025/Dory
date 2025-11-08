import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePersonalize = create(
  persist(
    (set) => ({
      profile: {
        ageGroup: null,
        gradeLevel: null,
        learningNeed: null,
        font: null,
        background: null,
        reducedMotion: false,
        dyslexiaResponse: null,
      },
      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      draftText: '',
      setDraftText: (t) => set({ draftText: t }),
      clearDraftText: () => set({ draftText: '' }),
    }),
    {
      name: 'dory-profile',
    }
  )
);
