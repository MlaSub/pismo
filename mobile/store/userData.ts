import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import uuidGenerator from 'react-native-uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const UUID_KEY = 'user-uuid'

interface UserDataState {
    uuid: string | null
    name: string | null
    hasUuid: () => boolean
    getName: () => string | null
    createUuid: () => Promise<void>
    setName: (name: string) => void
    clearAll: () => Promise<void>
}

export const useUserDataStore = create<UserDataState>()(
    persist(
        (set, get) => ({
            uuid: null,
            name: null,
            hasUuid: () => get().uuid !== null,
            getName: () => get().name,
            createUuid: async () => {
                const newUuid = uuidGenerator.v4() as string
                await SecureStore.setItemAsync(UUID_KEY, newUuid)
                set({ uuid: newUuid })
            },
            setName: (name) => set({ name }),
            clearAll: async () => {
                await SecureStore.deleteItemAsync(UUID_KEY)
                await AsyncStorage.removeItem('user-data')
                set({ uuid: null, name: null })
            },
        }),
        {
            name: 'user-data',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ name: state.name }),
            onRehydrateStorage: () => () => {
                void SecureStore.getItemAsync(UUID_KEY).then((stored) => {
                    useUserDataStore.setState({ uuid: stored ?? null })
                })
            },
        }
    )
)
