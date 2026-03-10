import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import uuidGenerator from 'react-native-uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createUser } from '../utils/createUser'
import { loginUser } from '../utils/loginUser'

const UUID_KEY = 'user-uuid'

interface UserDataState {
    uuid: string | null
    username: string | null
    hydrated: boolean
    hasUuid: () => boolean
    getUsername: () => string | null
    getUuid: () => string | null
    setUsername: (username: string) => void
    registerUser: (username: string) => Promise<void>
    loginWithUuid: (uuid: string, username: string) => Promise<void>
    clearAll: () => Promise<void>
    setUuid: (uuid: string | null) => void
}

export const useUserDataStore = create<UserDataState>()(
    persist(
        (set, get) => ({
            uuid: null,
            username: null,
            hydrated: false,
            hasUuid: () => get().uuid !== null,
            getUsername: () => get().username,
            getUuid: () => get().uuid,
            setUuid: (uuid) => set({ uuid }),
            setUsername: (username) => set({ username }),
            registerUser: async (username) => {
                const newUuid = uuidGenerator.v4() as string
                await SecureStore.setItemAsync(UUID_KEY, newUuid)
                set({ uuid: newUuid, username })
                try {
                    await createUser({ username })
                } catch (error) {
                    await SecureStore.deleteItemAsync(UUID_KEY)
                    set({ uuid: null, username: null })
                    throw error
                }
            },
            loginWithUuid: async (uuid, username) => {
                await SecureStore.setItemAsync(UUID_KEY, uuid)
                set({ uuid, username })
                try {
                    await loginUser({ username })
                } catch (error) {
                    await SecureStore.deleteItemAsync(UUID_KEY)
                    set({ uuid: null, username: null })
                    throw error
                }
            },
            clearAll: async () => {
                await SecureStore.deleteItemAsync(UUID_KEY)
                await AsyncStorage.removeItem('user-data')
                set({ uuid: null, username: null })
            },
        }),
        {
            name: 'user-data',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ username: state.username }),
            onRehydrateStorage: () => () => {
                void SecureStore.getItemAsync(UUID_KEY).then((stored) => {
                    useUserDataStore.setState({ uuid: stored ?? null, hydrated: true })
                })
            },
        }
    )
)
