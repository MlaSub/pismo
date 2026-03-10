import { backendCall } from "./backendCall";

interface CreateUserParams {
    username: string;
    name?: string;
}

interface UserResponse {
    id: number;
    username: string;
    uuid: string | null;
    created_at: string;
    updated_at: string;
}

export const createUser = async ({ username, name }: CreateUserParams): Promise<UserResponse> => {
    const data = await backendCall({
        method: "POST",
        urlExtension: "/users/new",
        body: { username, ...(name !== undefined && { name }) },
    });

    return data as UserResponse;
};