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


