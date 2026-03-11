import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getEssays } from '../utils/essayMngm'

type AnalysisStatus = "new" | "processing" | "complete" | "error";

export interface EssayResponse {
    id: number;
    title: string;
    cerf_level_grade: string | null;
    original_content: string | null;
    analyzed_content: string | null;
    created_at: string;
    analysis_status: AnalysisStatus;
}

interface EssayDataState {
    essays: EssayResponse[]
    fetchEssays: () => Promise<void>
}

export const useEssayDataStore = create<EssayDataState>()(
    persist(
        (set) => ({
            essays: [] as EssayResponse[],
            fetchEssays: async () => {
                try {
                    const response = await getEssays()
                    set({ essays: response })
                } catch (error) {
                    console.error("Error fetching essays:", error)
                }
            }
        }),
        {
            name: 'essay-data',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)

