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
    const { data } = await apiClient.post<T>(url, payload);
    return data;
};

// Example Hook using React Query
export const useUsers = (options?: UseQueryOptions<User[], Error>) => {
    return useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: () => fetchData<User[]>('/users'),
        ...options,
    });
};

export const useCreateUser = (options?: UseMutationOptions<User, Error, CreateUserDTO>) => {
    return useMutation<User, Error, CreateUserDTO>({
        mutationFn: (newUser) => postData<User, CreateUserDTO>('/users', newUser),
        ...options,
    });
};
