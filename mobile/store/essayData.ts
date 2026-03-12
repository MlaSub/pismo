import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getEssayDetail, getEssays } from '../utils/essayMngm'

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

export interface FeedbackItem {
    id: number;
    feedback_origin: string;
    category: string;
    short_mistake_summary: string;
    comments: string | null;
}

export interface EssayAnalysis {
    id: number;
    analysis_result: string;
    confidence: string;
    recommendations: string | null;
}

export interface EssayDetailResponse extends EssayResponse {
    analysis: EssayAnalysis | null;
    feedback_items: FeedbackItem[];
}

export interface EssayStatusResponse {
    processing_status: string;
    detail: EssayDetailResponse | null;
}

interface EssayDataState {
    essays: EssayResponse[]
    selectedEssay: EssayDetailResponse | null
    fetchEssays: () => Promise<void>
    fetchEssayDetail: (essay_id: number) => Promise<boolean>
    clearAll: () => void
}

export const useEssayDataStore = create<EssayDataState>()(
    persist(
        (set) => ({
            essays: [] as EssayResponse[],
            selectedEssay: null,

            fetchEssays: async () => {
                try {
                    const response = await getEssays()
                    set({ essays: response })
                } catch (error) {
                    console.error("Error fetching essays:", error)
                }
            },

            clearAll: () => {
                set({ essays: [], selectedEssay: null })
            },

            fetchEssayDetail: async (essay_id: number) => {
                try {
                    const response = await getEssayDetail(essay_id)
                    set({ selectedEssay: response.detail })
                    return response.detail !== null
                } catch (error) {
                    console.error("Error fetching essay detail:", error)
                    return false
                }
            },
        }),
        {
            name: 'essay-data',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)

