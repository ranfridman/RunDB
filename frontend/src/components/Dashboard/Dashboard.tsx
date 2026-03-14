import { useState, useEffect, useMemo, useCallback } from "react"
import { Box, Text, Group, Stack, Badge, RingProgress, Loader, Center } from "@mantine/core"
import { Database, PieChart, Plus } from "lucide-react"
import classes from './Dashboard.module.css';
import { Board } from './Board/Board';
import { DashboardHeader } from './Header/DashboardHeader';
import { DashboardRow, PanelType, PanelRegistry, Panel, PanelActionsContext } from './Board/types';
import { DinamicGraph } from '../DinamicGraph/DinamicGraph';
import { ComplexTable } from '../ComplexTable/ComplexTable';
import { data } from '../DinamicGraph/mockData';
import { PromptInput } from "../PromptInput/PromptInput";
import { EmptyDashboardCell } from "./EmptyDashboardCell/EmptyDashboardCell";
import { useSQLQuery } from "../../api/db";

const EMPTY_DATA: any[] = [];

const PanelDataWrapper = ({ Component, props }: { Component: any, props: any }) => {
    const { panel } = props;
    const needFetch = !panel.data || panel.data.length === 0;
    const query = needFetch ? panel.sqlQuery : undefined;
    const { data: queryData } = useSQLQuery(query);
    const data = needFetch ? queryData?.data : panel.data;
    return <Component {...props} data={data} />;
};

export const panelRegistry: PanelRegistry = {
    table: {
        label: 'Table',
        icon: <Database size={14} />,
        component: (props: any) => <PanelDataWrapper Component={ComplexTable} props={{ ...props, height: "100%" }} />
    },
    graph: {
        label: 'Graph',
        icon: <PieChart size={14} />,
        component: (props: any) => <PanelDataWrapper Component={DinamicGraph} props={props} />
    },
    new: { label: 'New Slot', icon: <Plus size={14} />, component: (props: any) => <EmptyDashboardCell {...props} /> },
};



export const Dashboard = () => {
    const [title, setTitle] = useState('Analysis by team');
    const [isEditMode, setIsEditMode] = useState(false);
    const [rows, setRows] = useState<DashboardRow[]>([
        {
            id: 'r1', height: 1.2, panels: [{ id: 'p1', type: 'new', name: 'Main Data', flex: 1 },
            ]
        },
    ]);
    const [showPrompt, setShowPrompt] = useState(false);

    const addPanel = useCallback((label: string) => {
        const configs: Record<string, Partial<Panel>> = {
            'AI': { type: 'new', initialView: 'ai', name: 'AI Analysis' },
            'SQL': { type: 'new', initialView: 'sql', name: 'SQL Query' },
            'Empty': { type: 'new', name: 'New Slot' },
            'Chart': { type: 'graph', data, name: 'Chart' },
            'Table': { type: 'table', data, name: 'Table' }
        };

        const config = configs[label] || configs['Empty'];

        setRows(prev => [{
            id: `r${Date.now()}`,
            height: 1,
            panels: [{
                id: `p${Date.now()}`,
                type: 'new',
                flex: 1,
                ...config,
            }]
        }, ...prev]);
    }, []);

    const del = useCallback((ri: number, pi: number) => setRows(prev => {
        const r = prev[ri];
        if (r.panels.length > 1) {
            const next = [...prev];
            const filteredPanels = r.panels.filter((_, i) => i !== pi);
            // Re-normalize flex if needed, but for now just keep them
            next[ri] = { ...r, panels: filteredPanels };
            return next;
        }
        return prev.length > 1 ? prev.filter((_, i) => i !== ri) : prev;
    }), []);

    const toggle = useCallback((i: number) => setRows(prev => {
        const next = [...prev];
        const r = { ...next[i] };
        if (r.panels.length < 4) {
            r.panels = [...r.panels, { id: `p${Date.now()}`, type: 'new', flex: 1 }];
        }
        next[i] = r;
        return next;
    }), []);

    const updatePanel = useCallback((id: string, updates: Partial<Panel>) => {
        setRows(prev => prev.map(row => ({
            ...row,
            panels: row.panels.map(p => p.id === id ? { ...p, ...updates } : p)
        })));
    }, []);

    const actionsValue = useMemo(() => ({ updatePanel, isEditMode }), [updatePanel, isEditMode]);

    const handleExport = () => {
        const exportRows = rows.map(row => ({
            ...row,
            panels: row.panels.map(panel => {
                if (panel.sqlQuery) {
                    const { data, ...rest } = panel;
                    return rest;
                }
                return panel;
            })
        }));
        const jsonString = JSON.stringify({ title, rows: exportRows }, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", `${title || 'dashboard'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        URL.revokeObjectURL(url);
    };

    const handleImport = (file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    const parsed = JSON.parse(content);
                    console.log('Imported parsed dashboard data:', parsed);

                    if (parsed.title !== undefined && Array.isArray(parsed.rows)) {
                        setTitle(parsed.title);
                        setRows(parsed.rows);
                    } else {
                        console.error("Invalid dashboard configuration file, parsed object:", parsed);
                        alert("Invalid dashboard configuration file. Make sure it contains a title and an array of rows.");
                    }
                }
            } catch (error) {
                console.error("Error parsing JSON file", error);
                alert("Error parsing JSON file. The file might be corrupted or not valid JSON.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <PanelActionsContext.Provider value={actionsValue}>
            <Box className={classes.grid} mih="89vh">
                <DashboardHeader
                    onAddPanel={addPanel}
                    title={title}
                    onTitleChange={setTitle}
                    isEditMode={isEditMode}
                    onToggleEditMode={() => setIsEditMode(prev => !prev)}
                    onExport={handleExport}
                    onImport={handleImport}
                />

                {showPrompt && (
                    <Box p="md" style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
                        <PromptInput
                            modes={[]}
                            onSubmit={(value) => {
                                addPanel(value.length > 30 ? value.substring(0, 30) + '...' : value);
                                setShowPrompt(false);
                            }}
                            onClose={() => setShowPrompt(false)}
                        />
                    </Box>
                )}

                <Board
                    rows={rows}
                    onRowsChange={setRows}
                    onRemovePanel={del}
                    onToggleSlot={toggle}
                    panelRegistry={panelRegistry}
                    height={rows.reduce((acc, r) => acc + (r.height || 1), 0) * 400 + (isEditMode ? 100 : 0)}
                    isEditMode={isEditMode}
                />
            </Box>
        </PanelActionsContext.Provider>
    );
};
