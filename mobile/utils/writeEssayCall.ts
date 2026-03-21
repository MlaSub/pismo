import { backendCall } from './backendCall';

export interface WriteEssayDraftResponse {
    id: number;
    title: string | null;
    content: string | null;
    created_at: string;
    updated_at: string;
}

export const createEssayDraft = async (
    title: string | null,
    content: string | null,
): Promise<WriteEssayDraftResponse> => {
    const data = await backendCall({
        urlExtension: '/write-essay/new',
        method: 'POST',
        body: { title, content },
    });
    return data as WriteEssayDraftResponse;
};

export const getAllEssayDrafts = async (): Promise<WriteEssayDraftResponse[]> => {
    const data = await backendCall({
        urlExtension: '/write-essay/all',
        method: 'GET',
    });
    return data as WriteEssayDraftResponse[];
};

export const getEssayDraft = async (draftId: number): Promise<WriteEssayDraftResponse> => {
    const data = await backendCall({
        urlExtension: `/write-essay/${draftId}`,
        method: 'GET',
    });
    return data as WriteEssayDraftResponse;
};

export const updateEssayDraft = async (
    draftId: number,
    title: string | null,
    content: string | null,
): Promise<WriteEssayDraftResponse> => {
    const data = await backendCall({
        urlExtension: `/write-essay/${draftId}`,
        method: 'PATCH',
        body: { title, content },
    });
    return data as WriteEssayDraftResponse;
};

export const deleteEssayDraft = async (draftId: number): Promise<void> => {
    await backendCall({
        urlExtension: `/write-essay/${draftId}`,
        method: 'DELETE',
    });
};
