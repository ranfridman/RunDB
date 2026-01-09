import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import apiClient from './client';

// Example types - replace with your actual data types
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface CreateUserDTO {
    name: string;
    email: string;
}

// Generic fetcher
export const fetchData = async <T>(url: string): Promise<T> => {
    const { data } = await apiClient.get<T>(url);
    return data;
};

// Generic poster
export const postData = async <T, D>(url: string, payload: D): Promise<T> => {
    try {
        const { data } = await apiClient.post<T>(url, payload);
        return data;
    } catch (error: any) {
        if (error.response?.status === 422) {
            console.error('Validation Error (422):', error.response.data);
        }
        throw error;
    }
};

