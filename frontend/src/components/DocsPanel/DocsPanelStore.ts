import { createStore } from 'zustand';
import { useStore } from 'zustand';
import { createContext, useContext, useRef } from 'react';

export interface DocsPanelState {
    selectedItemId: string | null;
    selectedItemType: 'table' | 'column' | 'schema' | null;
    isEditing: boolean;
    setSelected: (id: string | null, type: 'table' | 'column' | 'schema' | null) => void;
    setIsEditing: (isEditing: boolean) => void;
}

export const createDocsPanelStore = () =>
    createStore<DocsPanelState>((set) => ({
        selectedItemId: null,
        selectedItemType: null,
        isEditing: false,
        setSelected: (id, type) => set({ selectedItemId: id, selectedItemType: type }),
        setIsEditing: (isEditing) => set({ isEditing }),
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
