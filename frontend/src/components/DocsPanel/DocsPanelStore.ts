import { createStore } from 'zustand';
import { useStore } from 'zustand';
import { createContext, useContext, useRef } from 'react';
import mockDbData from './mockDbData.json';

export type DbData = typeof mockDbData;

export interface DocsPanelState {
    selectedItemId: string | null;
    selectedItemType: 'table' | 'column' | 'schema' | null;
    isEditing: boolean;
    activeTab: string;
    dbData: DbData | null;
    setSelected: (id: string | null, type: 'table' | 'column' | 'schema' | null) => void;
    setIsEditing: (isEditing: boolean) => void;
    setActiveTab: (tab: string) => void;
    setDbData: (data: DbData) => void;
}

export const createDocsPanelStore = () =>
    createStore<DocsPanelState>((set) => ({
        selectedItemId: null,
        selectedItemType: null,
        isEditing: false,
        activeTab: 'overview',
        dbData: null,
        setSelected: (id, type) => set({ selectedItemId: id, selectedItemType: type }),
        setIsEditing: (isEditing) => set({ isEditing }),
        setActiveTab: (activeTab) => set({ activeTab }),
        setDbData: (dbData) => set({ dbData }),
    }));

export type DocsPanelStore = ReturnType<typeof createDocsPanelStore>;

export const DocsPanelContext = createContext<DocsPanelStore | null>(null);

export function useDocsPanelStore<T>(selector: (state: DocsPanelState) => T): T {
    const store = useContext(DocsPanelContext);
    if (!store) throw new Error('Missing DocsPanelProvider in the tree');
    return useStore(store, selector);
}

export function useDocsPanelProvider() {
    const storeRef = useRef<DocsPanelStore>(null);
    if (!storeRef.current) {
        storeRef.current = createDocsPanelStore();
    }
    return storeRef.current;
}
