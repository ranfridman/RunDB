import { ReactNode, ComponentType, createContext } from 'react';

export type PanelType = 'graph' | 'table' | 'new';

export interface Panel {
    id: string;
    type: PanelType;
    name?: string;
    data?: any[];
    chartType?: string;
    initialView?: 'options' | 'ai' | 'sql' | 'visual';
}

export interface DashboardRow {
    id: string;
    height: number;
    colSplit: number;
    panels: Panel[];
}

export type PanelRegistry = Record<PanelType, {
    label: string,
    icon: ReactNode,
    component: ComponentType<{ panel: Panel; headerRef?: HTMLElement | null }>
}>;

export interface PanelActionsContextType {
    updatePanel: (id: string, updates: Partial<Panel>) => void;
    isEditMode: boolean;
}

export const PanelActionsContext = createContext<PanelActionsContextType | null>(null);
