import axios, { type AxiosRequestConfig } from "axios";

import { useUserDataStore } from "../store/userData";

// eslint-disable-next-line no-undef
export const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

interface BackendCallParams {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    urlExtension: string
    body?: object | null
}

const MAX_RETRIES = 2;

async function attemptRequest(config: AxiosRequestConfig, attempt: number): Promise<unknown> {
    try {

        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (attempt < MAX_RETRIES) {
            console.warn(`Request failed, retrying... (${attempt + 1}/${MAX_RETRIES})`);
            return attemptRequest(config, attempt + 1);
        }
        throw error;
    }
}

export async function backendCall({ method, urlExtension, body = null }: BackendCallParams) {
    console.info('Request URL:', `${apiBaseUrl}${urlExtension}`);
    const { clearAll, getUuid } = useUserDataStore.getState();
    const uuid = getUuid();

    if (!uuid) {
        console.error("No UUID found.");
        throw new Error("UUID is missing");
    }

    const config: AxiosRequestConfig = {
        method,
        url: `${apiBaseUrl}${urlExtension}`,
        headers: {
            "Content-Type": "application/json",
            "X-User-UUID": uuid,
        },
    };

    if (body !== null) {
        config.data = body;
    }

    try {
        return await attemptRequest(config, 0);
    } catch (error) {
        await clearAll();
        throw error;
    }
}
