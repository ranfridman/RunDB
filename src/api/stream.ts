import { useMutation } from '@tanstack/react-query';
import apiClient from './client';

export interface StreamRequest {
    mode: string;
    prompt: string;
}



export const streamAIResponse = async (
    { mode, prompt }: StreamRequest,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
): Promise<void> => {
    let lastIndex = 0;

    await apiClient.post('api/v1/chat/stream', { mode, prompt }, {
        signal,
        onDownloadProgress: (progressEvent) => {
            const xhr = progressEvent.event.target;
            const response = xhr.response || xhr.responseText;

            const chunk = response.slice(lastIndex);
            if (chunk) {
                onChunk(chunk);
                lastIndex = response.length;
            }
        }
    });
};

export const useStreamAIResponse = ({ mode, prompt }: StreamRequest) => {
    return useMutation({
        mutationFn: (onChunk: (chunk: string) => void) => streamAIResponse({ mode, prompt }, onChunk),
        mutationKey: ['stream', mode, prompt],
    });
};
