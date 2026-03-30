import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
    createEssayDraft,
    deleteEssayDraft,
    getAllEssayDrafts,
    updateEssayDraft,
    type WriteEssayDraftResponse,
} from '../utils/writeEssayCall'

const STORAGE_KEY = 'write-essay-storage'

interface WriteEssayState {
    essayTitle: string;
    essayContent: string;
    savedDraftId: number | null;
    drafts: WriteEssayDraftResponse[];
    setEssayTitle: (title: string) => void;
    setEssayContent: (content: string) => void;
    cleanEssayData: () => void;
    fetchDrafts: () => Promise<void>;
    saveOrCreateDraft: () => Promise<void>;
    deleteDraft: (draftId: number) => Promise<void>;
    updateDraftIfUnsaved: () => Promise<void>;
}

type SetState = (partial: Partial<WriteEssayState>) => void
type GetState = () => WriteEssayState

const createActions = (set: SetState, get: GetState) => ({
    setEssayTitle: (title: string) => set({ essayTitle: title }),
    setEssayContent: (content: string) => set({ essayContent: content }),
    cleanEssayData: () => set({ essayTitle: '', essayContent: '', savedDraftId: null, drafts: [] }),
    fetchDrafts: async () => {
        const drafts = await getAllEssayDrafts()
        set({ drafts })
    },
    saveOrCreateDraft: async () => {
        const { essayTitle, essayContent, savedDraftId, drafts } = get()
        if (savedDraftId !== null) {
            const updated = await updateEssayDraft(savedDraftId, essayTitle, essayContent)
            set({ drafts: drafts.map((d) => (d.id === savedDraftId ? updated : d)) })
        } else {
            const created = await createEssayDraft(essayTitle, essayContent)
            set({ savedDraftId: created.id, drafts: [...drafts, created] })
        }
        set({ essayTitle: '', essayContent: '' })
    },
    deleteDraft: async (draftId: number) => {
        await deleteEssayDraft(draftId)
        const { savedDraftId, drafts } = get()
        set({
            drafts: drafts.filter((d) => d.id !== draftId),
            ...(savedDraftId === draftId
                ? { savedDraftId: null, essayTitle: '', essayContent: '' }
                : {}),
        })
    },
    updateDraftIfUnsaved: async () => {
        const { essayTitle, essayContent, savedDraftId, drafts } = get()
        if (savedDraftId === null) return
        const current = drafts.find((d) => d.id === savedDraftId)
        if (current?.title === essayTitle && current?.content === essayContent) return
        const updated = await updateEssayDraft(savedDraftId, essayTitle, essayContent)
        set({ drafts: drafts.map((d) => (d.id === savedDraftId ? updated : d)) })
    },
})

export const useWriteEssayStore = create<WriteEssayState>()(
    persist(
        (set, get) => ({
            essayTitle: '',
            essayContent: '',
            savedDraftId: null,
            drafts: [],
            ...createActions(set, get),
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                essayTitle: state.essayTitle,
                essayContent: state.essayContent,
                savedDraftId: state.savedDraftId,
            }),
        }
    )
)
