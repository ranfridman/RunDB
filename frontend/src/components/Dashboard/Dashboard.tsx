import { useState, useEffect } from "react"
import { Box, Text, Group, Stack, Badge, RingProgress } from "@mantine/core"
import { Database, PieChart, Plus } from "lucide-react"
import classes from './Dashboard.module.css';
import { Board } from './Board/Board';
import { DashboardHeader } from './Header/DashboardHeader';
import { DashboardRow, PanelType, PanelRegistry, Panel, PanelActionsContext } from './Board/types';
import { DinamicGraph } from '../DinamicGraph/DinamicGraph';
import { ComplexTable } from '../ComplexTable/ComplexTable';
import { data } from '../DinamicGraph/mockData';

export const panelRegistry: PanelRegistry = {
    table: { label: 'Table', icon: <Database size={14} />, component: (props: any) => <ComplexTable {...props} data={data} height="100%" /> },
    graph: { label: 'Graph', icon: <PieChart size={14} />, component: (props: any) => <DinamicGraph {...props} data={data} /> },
    new: { label: 'New Slot', icon: <Plus size={14} />, component: () => <Text size="xs" c="dimmed">Empty</Text> as any },
};



export const Dashboard = () => {
    const [title, setTitle] = useState('Analysis by team');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rows, setRows] = useState<DashboardRow[]>([
        { id: 'r1', height: 1.2, colSplit: 60, panels: [{ id: 'p1', type: 'table', name: 'Main Data' }, { id: 'p2', type: 'graph', name: 'Analysis' }] },
    ]);

    const addPanel = (name: string) => {
        const type: PanelType = name === 'Chart' ? 'graph' : 'table';
        setRows(prev => [{ id: `r${Date.now()}`, height: 1, colSplit: 50, panels: [{ id: `p${Date.now()}`, type, name }] }, ...prev]);
    };

    const del = (ri: number, pi: number) => setRows(prev => {
        const r = prev[ri];
        if (r.panels.length > 1) {
            const next = [...prev];
            next[ri] = { ...r, panels: r.panels.filter((_, i) => i !== pi), colSplit: 50 };
            return next;
        }
        return prev.length > 1 ? prev.filter((_, i) => i !== ri) : prev;
    });

    const toggle = (i: number) => setRows(prev => {
        const next = [...prev];
        const r = { ...next[i] };
        if (r.panels.length === 1) {
            r.panels = [...r.panels, { id: `p${Date.now()}`, type: 'new' }];
            r.colSplit = 50;
        } else {
            r.panels = [r.panels[0]];
        }
        next[i] = r;
        return next;
    });

    const updatePanel = (id: string, updates: Partial<Panel>) => {
        setRows(prev => prev.map(row => ({
            ...row,
            panels: row.panels.map(p => p.id === id ? { ...p, ...updates } : p)
        })));
    };

    return (
        <PanelActionsContext.Provider value={{ updatePanel, isEditMode }}>
            <Box className={classes.grid} mih="89vh">
                <DashboardHeader
                    onAddPanel={addPanel}
                    title={title}
                    onTitleChange={setTitle}
                    isEditMode={isEditMode}
                    onToggleEditMode={() => setIsEditMode(prev => !prev)}
                />

                <Board
                    rows={rows}
                    onRowsChange={setRows}
                    onRemovePanel={del}
                    onToggleSlot={toggle}
                    panelRegistry={panelRegistry}
                    height={rows.length * 400}
                    isEditMode={isEditMode}
                />
            </Box>
        </PanelActionsContext.Provider>
    );
};