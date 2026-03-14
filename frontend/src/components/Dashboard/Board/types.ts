import { ReactNode, ComponentType, createContext } from 'react';

export type PanelType = 'graph' | 'table' | 'new';

export interface Panel {
    id: string;
    type: PanelType;
    name?: string;
    data?: any[];
    chartType?: string;
    chartConfig?: any;
    initialView?: 'options' | 'ai' | 'sql' | 'visual';
    sourceView?: 'ai' | 'sql' | 'visual';
    sqlQuery?: string;
    flex?: number;
}

export interface DashboardRow {
    id: string;
    height: number;
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
