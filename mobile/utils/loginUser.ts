import { backendCall } from "./backendCall";
import type { CefrLevel } from "./createUser";

interface LoginUserParams {
    username: string;
}

interface UserResponse {
    id: number;
    username: string;
    uuid: string | null;
    target_cefr_level: CefrLevel | null;
    created_at: string;
    updated_at: string;
}

export const loginUser = async ({ username }: LoginUserParams): Promise<UserResponse> => {
    const data = await backendCall({
        method: "POST",
        urlExtension: "/users/login",
        body: { username },
    });

    return data as UserResponse;
};