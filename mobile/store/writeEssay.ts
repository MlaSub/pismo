import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface WriteEssay {
    essayTitle: string;
    essayContent: string;
    setEssayTitle: (title: string) => void;
    setEssayContent: (content: string) => void;
    cleanEssayData: () => void;
}

export const useWriteEssayStore = create<WriteEssay>()(
    persist(
        (set) => ({
            essayTitle: '',
            essayContent: '',
            setEssayTitle: (title: string) => set({ essayTitle: title }),
            setEssayContent: (content: string) => set({ essayContent: content }),
            cleanEssayData: () => set({ essayTitle: '', essayContent: '' }),
        }),
        {
            name: 'write-essay-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
