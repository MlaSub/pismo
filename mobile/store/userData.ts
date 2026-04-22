import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import uuidGenerator from 'react-native-uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createUser, updateUser, type CefrLevel } from '../utils/createUser'
import { loginUser } from '../utils/loginUser'
import { registerForPushNotifications } from '../utils/notifications'

const UUID_KEY = 'user-uuid'
const STORAGE_KEY = 'user-data'

interface UserDataState {
    uuid: string | null
    username: string | null
    targetCefrLevel: CefrLevel | null
    pushToken: string | null
    hydrated: boolean
    registerUser: (username: string, targetCefrLevel: CefrLevel) => Promise<void>
    loginWithUuid: (uuid: string, username: string) => Promise<void>
    updateUserData: (username?: string, targetCefrLevel?: CefrLevel) => Promise<void>
    syncPushToken: () => Promise<void>
    clearAll: () => Promise<void>
}

type SetState = (partial: Partial<UserDataState>) => void
type GetState = () => UserDataState

async function tryGetPushToken(): Promise<string | null> {
    try {
        return await registerForPushNotifications()
    } catch {
        return null
    }
}

const createActions = (set: SetState, get: GetState) => ({
    registerUser: async (username: string, targetCefrLevel: CefrLevel) => {
        const newUuid = uuidGenerator.v4() as string
        const pushToken = await tryGetPushToken()
        await createUser({ username, target_cefr_level: targetCefrLevel, push_token: pushToken })
        await SecureStore.setItemAsync(UUID_KEY, newUuid)
        set({ uuid: newUuid, username, targetCefrLevel, pushToken })
    },
    loginWithUuid: async (uuid: string, username: string) => {
        await SecureStore.setItemAsync(UUID_KEY, uuid)
        set({ uuid, username })
        try {
            const response = await loginUser({ username })
            set({ targetCefrLevel: response.target_cefr_level })
            await get().syncPushToken()
        } catch (error) {
            await SecureStore.deleteItemAsync(UUID_KEY)
            set({ uuid: null, username: null, targetCefrLevel: null })
            throw error
        }
    },
    syncPushToken: async () => {
        if (!get().uuid) return
        const currentToken = await tryGetPushToken()
        if (!currentToken || currentToken === get().pushToken) return
        await updateUser({ push_token: currentToken })
        set({ pushToken: currentToken })
    },
    updateUserData: async (username?: string, targetCefrLevel?: CefrLevel) => {
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
        await AsyncStorage.removeItem(STORAGE_KEY)
        set({ uuid: null, username: null, targetCefrLevel: null, pushToken: null })
    },
})

export const useUserDataStore = create<UserDataState>()(
    persist(
        (set, get) => ({
            uuid: null,
            username: null,
            targetCefrLevel: null,
            pushToken: null,
            hydrated: false,
            ...createActions(set, get),
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ username: state.username, targetCefrLevel: state.targetCefrLevel, pushToken: state.pushToken }),
            onRehydrateStorage: () => async () => {
                const stored = await SecureStore.getItemAsync(UUID_KEY)
                useUserDataStore.setState({ uuid: stored ?? null, hydrated: true })
            },
        }
    )
)
