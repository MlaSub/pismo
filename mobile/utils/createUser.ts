import { backendCall } from "./backendCall";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface CreateUserParams {
    username: string;
    target_cefr_level: CefrLevel;
}

interface UserResponse {
    id: number;
    username: string;
    uuid: string | null;
    target_cefr_level: CefrLevel;
    created_at: string;
    updated_at: string;
}

export const createUser = async ({ username, target_cefr_level }: CreateUserParams): Promise<UserResponse> => {
    const data = await backendCall({
        method: "POST",
        urlExtension: "/users/new",
        body: { username, target_cefr_level },
    });

    return data as UserResponse;
};