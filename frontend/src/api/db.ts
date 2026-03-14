import { useMutation, useQuery } from "@tanstack/react-query";
import { postData } from "./queries";
import { DatabaseTreeNodeData } from "@/components/DatabaseTreeSection/data";

export interface DBStructureResponse {
    data: DatabaseTreeNodeData[];
}

export interface DBCreds {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

// Raw async function - can be called directly (e.g., in event handlers)
export const validateDBCredentials = (uri: string) =>
    postData<boolean, { uri: string }>('/api/v1/db/validate', { uri });

// React hook version - use when you need React Query's state management
export const useValidateDB = () => useMutation({
    mutationFn: validateDBCredentials,
});

export const getDBStructure = (uri?: string) => useQuery({
    queryKey: ['db-structure', uri],
    queryFn: () => postData<DBStructureResponse, { uri: string }>('/api/v1/db/structure', { uri: uri! }),
    enabled: !!uri,
});

export interface DBQueryResponse {
    success: boolean;
    data: any[];
    error?: string;
}

export const executeSQLQuery = (query: string, uri?: string) =>
    postData<DBQueryResponse, { query: string; uri?: string }>('/api/v1/db/query', { query, uri });

export const useSQLQuery = (query?: string, uri?: string) => useQuery({
    queryKey: ['sql-query', query, uri],
    queryFn: () => postData<DBQueryResponse, { query: string; uri?: string }>('/api/v1/db/query', { query: query!, uri }),
    enabled: !!query,
    initialData: {
        success: true, data: [{ name: "A", value: 10, category: "alpha", score: 88, active: true },
        { name: "B", value: 24, category: "beta", score: 72, active: false },
        { name: "C", value: 37, category: "alpha", score: 95, active: true },
        { name: "D", value: 15, category: "gamma", score: 61, active: true },
        { name: "E", value: 52, category: "beta", score: 79, active: false }]
    },
});



