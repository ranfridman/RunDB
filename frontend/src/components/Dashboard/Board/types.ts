import { ReactNode, ComponentType } from 'react';

export type PanelType = 'graph' | 'table' | 'new';

export interface Panel {
    id: string;
    type: PanelType;
    name?: string;
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
    component: ComponentType<{ panel: Panel }>
}>;
