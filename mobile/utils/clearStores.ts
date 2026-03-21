import { useEssayDataStore } from '@/store/essayData'
import { useUserDataStore } from '@/store/userData'
import { useWriteEssayStore } from '@/store/writeEssay'

export const clearAllStores = () => {
    void useUserDataStore.getState().clearAll()
    void useEssayDataStore.getState().clearAll()
    void useWriteEssayStore.getState().cleanEssayData()
}
