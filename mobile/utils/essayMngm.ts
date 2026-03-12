import type { EssayResponse, EssayStatusResponse } from "../store/essayData";

import { backendCall } from "./backendCall";

export const getEssays = async (): Promise<EssayResponse[]> => {
    const data = await backendCall({
        urlExtension: "/essay/all",
        method: "GET",
    });
    return data as EssayResponse[];
}

export const getEssayDetail = async (essay_id: number): Promise<EssayStatusResponse> => {
    const data = await backendCall({
        urlExtension: "/essay/detail",
        method: "POST",
        body: { essay_id }
    });
    return data as EssayStatusResponse;
}
