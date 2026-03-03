import { create } from 'zustand';

interface UIUXStore {
    components: Record<string, {
        name: string;
        type: any;
        props: any;
        injectedProps: any;
    }>;
    setComponent: (id: string, name: string, type: any, props: any, injectedProps: any) => void;
}

export const useUIUXStore = create<UIUXStore>((set) => ({
    components: {},
    setComponent: (id, name, type, props, injectedProps) =>
        set((state) => ({
            components: {
                ...state.components,
                [id]: { name, type, props, injectedProps },
            },
        })),
}));
