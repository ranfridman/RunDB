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
    const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, prompt }),
        signal,
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }
    } finally {
        reader.releaseLock();
    }
};

export const useStreamAIResponse = ({ mode, prompt }: StreamRequest) => {
    return useMutation({
        mutationFn: (onChunk: (chunk: string) => void) => streamAIResponse({ mode, prompt }, onChunk),
        // mutationKey: ['stream', mode, prompt],
    });
};
