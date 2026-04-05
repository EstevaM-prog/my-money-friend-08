import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PrivacyState {
  isPrivate: boolean;
  togglePrivacy: () => void;
}

export const usePrivacy = create<PrivacyState>()(
  persist(
    (set) => ({
      isPrivate: false,
      togglePrivacy: () => set((state) => ({ isPrivate: !state.isPrivate })),
    }),
    {
      name: "mymoneyfriend_privacy",
    }
  )
);
