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
export const validateDBCredentials = (creds: DBCreds) =>
    postData<boolean, DBCreds>('/api/v1/db/validate', creds);

// React hook version - use when you need React Query's state management
export const useValidateDB = () => useMutation({
    mutationFn: validateDBCredentials,
});

export const getDBStructure = (creds?: DBCreds) => useQuery({
    queryKey: ['db-structure', creds],
    queryFn: () => postData<DBStructureResponse, DBCreds>('/api/v1/db/structure', creds!),
    enabled: !!creds,
});


