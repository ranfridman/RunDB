import { create } from 'zustand';
import { ChartType, ChartConfig } from '../../DinamicGraph/GraphSettingsPanel/types';

interface PanelState {
    chartType: ChartType;
    config: ChartConfig | null;
}

interface DashboardStore {
    panelStates: Record<string, PanelState>;
    setPanelState: (id: string, state: Partial<PanelState>) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    panelStates: {},
    setPanelState: (id, state) => set((prev) => ({
        panelStates: {
            ...prev.panelStates,
            [id]: {
                ...(prev.panelStates[id] || { chartType: 'area', config: null }),
                ...state
            }
        }
    })),
}));
