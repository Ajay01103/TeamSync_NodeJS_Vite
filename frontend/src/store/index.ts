import { create, StateCreator } from "zustand"
import { immer } from "zustand/middleware/immer"
import { devtools, persist } from "zustand/middleware"
import createSelectors from "./selectors"

type AuthState = {
  accessToken: string | null
  user: any | null
  setUser: (user: any) => void
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
}

const createAuthSlice: StateCreator<AuthState> = (set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user: any) => set({ user }),
  clearAccessToken: () => set({ accessToken: null }),
})

type StoreType = AuthState

export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),

      {
        name: "session-storage", // Name of the item in localStorage (or sessionStorage)
        getStorage: () => sessionStorage, // (optional) by default it's localStorage
      }
    )
  )
)

export const useStore = createSelectors(useStoreBase)
