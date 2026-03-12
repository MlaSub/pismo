import { useEssayDataStore } from '@/store/essayData'
import { useUserDataStore } from '@/store/userData'

export const clearAllStores = () => {
    void useUserDataStore.getState().clearAll()
    void useEssayDataStore.getState().clearAll()
}
