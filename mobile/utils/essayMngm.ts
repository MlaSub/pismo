import type { EssayResponse } from "../store/essayData";

import { backendCall } from "./backendCall";



export const getEssays = async (): Promise<EssayResponse[]> => {
    const data = await backendCall({
        urlExtension: "/essay/all",
        method: "GET",
    });
    return data as EssayResponse[];
}