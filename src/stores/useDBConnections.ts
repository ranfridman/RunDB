import { create } from "zustand";

interface DBConnection {
    id: string;
    name: string;
    type: string;
    connection: any;
}


interface DBConnectionsStore {
    dbConnections: DBConnection[];
    activeDB: string | null;
    dbModalOpen: string | null;

    addDBConnection: (dbConnection: DBConnection) => void;
    removeDBConnection: (id: string) => void;
    setActiveDB: (id: string | null) => void;
    setDBModal: (id: string | null) => void;
}

export const useDBConnectionsStore = create<DBConnectionsStore>((set) => ({
    dbConnections: [{ id: '1', name: 'Dsdf df', type: 'PostgreSQL', connection: {} }, { id: '2', name: 'DB2', type: 'PostgreSQL', connection: {} }],
    activeDB: '1',
    dbModalOpen: null,
    addDBConnection: (dbConnection: DBConnection) => set((state) => ({ dbConnections: [...state.dbConnections, dbConnection] })),
    removeDBConnection: (id: string) => set((state) => ({ dbConnections: state.dbConnections.filter((dbConnection) => dbConnection.id !== id) })),
    setActiveDB: (id: string | null) => set((state) => ({ activeDB: id })),
    setDBModal: (id: string | null) => set((state) => ({ dbModalOpen: id })),

}));
