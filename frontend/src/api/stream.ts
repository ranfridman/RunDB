import { useMutation } from '@tanstack/react-query';
import apiClient from './client';

export interface StreamRequest {
    mode: string;
    query: string;
    uri: string;
}



export const streamAIResponse = async (
    { mode, query, uri }: StreamRequest,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
): Promise<void> => {
    const response = await fetch('/api/v1/chat/research', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, query, uri }),
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

export const useStreamAIResponse = ({ mode, query, uri }: StreamRequest) => {
    return useMutation({
        mutationFn: (onChunk: (chunk: string) => void) => streamAIResponse({ mode, query, uri }, onChunk),
        // mutationKey: ['stream', mode, prompt],
    });
};
