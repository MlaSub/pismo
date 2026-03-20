import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import uuidGenerator from 'react-native-uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createUser, updateUser, type CefrLevel } from '../utils/createUser'
import { loginUser } from '../utils/loginUser'
import { registerForPushNotifications } from '../utils/notifications'

const UUID_KEY = 'user-uuid'

interface UserDataState {
    uuid: string | null
    username: string | null
    targetCefrLevel: CefrLevel | null
    pushToken: string | null
    hydrated: boolean
    hasUuid: () => boolean
    getUsername: () => string | null
    getUuid: () => string | null
    registerUser: (username: string, targetCefrLevel: CefrLevel) => Promise<void>
    loginWithUuid: (uuid: string, username: string) => Promise<void>
    updateUserData: (username?: string, targetCefrLevel?: CefrLevel) => Promise<void>
    syncPushToken: () => Promise<void>
    clearAll: () => Promise<void>
}

export const useUserDataStore = create<UserDataState>()(
    persist(
        // eslint-disable-next-line max-lines-per-function
        (set, get) => ({
            uuid: null,
            username: null,
            targetCefrLevel: null,
            pushToken: null,
            hydrated: false,
            hasUuid: () => get().uuid !== null,
            getUsername: () => get().username,
            getUuid: () => get().uuid,
            registerUser: async (username, targetCefrLevel) => {
                const newUuid = uuidGenerator.v4() as string
                await SecureStore.setItemAsync(UUID_KEY, newUuid)
                set({ uuid: newUuid, username, targetCefrLevel })
                try {
                    await createUser({ username, target_cefr_level: targetCefrLevel })
                } catch (error) {
                    await SecureStore.deleteItemAsync(UUID_KEY)
                    set({ uuid: null, username: null, targetCefrLevel: null })
                    throw error
                }
            },
            loginWithUuid: async (uuid, username) => {
                await SecureStore.setItemAsync(UUID_KEY, uuid)
                set({ uuid, username })
                try {
                    const response = await loginUser({ username })
                    set({ targetCefrLevel: response.target_cefr_level })
                } catch (error) {
                    await SecureStore.deleteItemAsync(UUID_KEY)
                    set({ uuid: null, username: null, targetCefrLevel: null })
                    throw error
                }
            },
            syncPushToken: async () => {
                const currentToken = await registerForPushNotifications()
                if (!currentToken) return
                if (currentToken === get().pushToken) return
                await updateUser({ push_token: currentToken })
                set({ pushToken: currentToken })
            },
            updateUserData: async (username, targetCefrLevel) => {
                const response = await updateUser({
                    username,
                    target_cefr_level: targetCefrLevel,
                })
                set({
                    username: response.username,
                    targetCefrLevel: response.target_cefr_level,
                })
            },
            clearAll: async () => {
                await SecureStore.deleteItemAsync(UUID_KEY)
                await AsyncStorage.removeItem('user-data')
                set({ uuid: null, username: null, targetCefrLevel: null, pushToken: null })
            },
        }),
        {
            name: 'user-data',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ username: state.username, targetCefrLevel: state.targetCefrLevel, pushToken: state.pushToken }),
            onRehydrateStorage: () => () => {
                void SecureStore.getItemAsync(UUID_KEY).then((stored) => {
                    useUserDataStore.setState({ uuid: stored ?? null, hydrated: true })
                })
            },
        }
    )
)
