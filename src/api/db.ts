import { useMutation } from "@tanstack/react-query";
import { postData } from "./queries";

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