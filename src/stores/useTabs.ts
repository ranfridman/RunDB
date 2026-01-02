import { create } from "zustand";


export interface Tab {
    id: string;
    label: string;
    type: string;
    query?: string;
}



interface TabsStore {
    tabs: Tab[];
    activeTab: string | null;
    addTab: (tab: Tab) => void;
    removeTab: (id: string) => void;
    setActiveTab: (id: string | null) => void;
    openTableTab: (id: string) => void;
}

export const useTabsStore = create<TabsStore>((set) => ({
    tabs: [],
    activeTab: "pluse",
    addTab: (tab: Tab) => set((state) => ({ tabs: [...state.tabs, tab], activeTab: tab.id })),
    removeTab: (id: string) => set((state) => ({ tabs: state.tabs.filter((t) => t.id !== id), activeTab: "pluse" })),
    setActiveTab: (id: string | null) => set((state) => ({ activeTab: id })),
    openTableTab: (id: string) => set((state) => {
        const index = state.tabs.findIndex((t) => t.id === id);
        if (index === -1)
            return ({ tabs: [...state.tabs, { id, label: "Table", type: "Table" }], activeTab: id });
        return { activeTab: state.tabs[index].id };
    }),
}))


