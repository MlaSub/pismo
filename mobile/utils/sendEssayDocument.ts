import axios from 'axios';

import { useUserDataStore } from '@/store/userData';
import { apiBaseUrl } from '@/utils/backendCall';

interface SendDocumentParams {
    uri: string;
    name: string;
    mimeType?: string;
}

const MAX_RETRIES = 2;

async function sendEssayDocument({ uri, name, mimeType }: SendDocumentParams): Promise<{ process_id: number }> {
    const { uuid } = useUserDataStore.getState();

    if (!uuid) {
        throw new Error('UUID is missing');
    }

    const formData = new FormData();
    formData.append('file', { uri, name, type: mimeType ?? 'application/pdf' } as unknown as Blob);

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await axios.post<{ process_id: number }>(
                `${apiBaseUrl}/essay/pdf`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-User-UUID': uuid,
                    },
                },
            );
            return response.data;
        } catch (error) {
            lastError = error;
            if (attempt < MAX_RETRIES) {
                console.warn(`Request failed, retrying... (${attempt + 1}/${MAX_RETRIES})`);
            }
        }
    }

    throw lastError;
}

export default sendEssayDocument;
