import { useState } from "react"
import { Box, Text, ActionIcon, Group, Stack, Badge, RingProgress } from "@mantine/core"
import { Plus, Database, Activity, Terminal, ShieldCheck, Zap } from "lucide-react"
import classes from './Dashboard.module.css';
import { Board, DashboardRow, Panel } from './Board/Board';

export type PanelType = 'schema' | 'performance' | 'logs' | 'environment' | 'new';

export const panelRegistry: Record<PanelType, { label: string; icon: any; content: any }> = {
    schema: { label: 'Schema', icon: <Database size={14} />, content: <Stack align="center" gap={0}><Text size="xl" fw={900} variant="gradient" gradient={{ from: 'yellow.4', to: 'orange.6' }}>DB_01</Text><Badge size="xs">Sync</Badge></Stack> },
    performance: { label: 'Performance', icon: <Activity size={14} />, content: <RingProgress size={80} thickness={8} sections={[{ value: 98, color: 'yellow' }]} label={<Text size="xs" ta="center">98%</Text>} /> },
    logs: { label: 'Logs', icon: <Terminal size={14} />, content: <Stack gap={4}><Text size="10px" ff="monospace" c="dimmed">GET /status 200</Text><Text size="10px" ff="monospace" c="dimmed">AUTH root OK</Text></Stack> },
    environment: { label: 'System', icon: <Zap size={14} />, content: <Stack align="center" gap={0}><Text size="xl" fw={900} c="green">99.9%</Text><Text size="10px" c="dimmed">Uptime 14d</Text></Stack> },
    new: { label: 'New Slot', icon: <Plus size={14} />, content: <Text size="xs" c="dimmed">Empty</Text> }
};

export const Dashboard = () => {
    const [rows, setRows] = useState<DashboardRow[]>([
        { id: 'r1', height: 1, colSplit: 60, panels: [{ id: 'p1', type: 'schema' }, { id: 'p2', type: 'performance' }] },
        { id: 'r2', height: 1, colSplit: 40, panels: [{ id: 'p3', type: 'logs' }, { id: 'p4', type: 'environment' }] }
    ]);

    const add = () => setRows(prev => [...prev, { id: `r${Date.now()}`, height: 1, colSplit: 50, panels: [{ id: `p${Date.now()}`, type: 'new' }] }]);

    // Board handles state updates for moves/resizes directly via setRows
    // We wrappers for delete/toggle to keep logic consistent
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
        const next = [...prev]; const r = { ...next[i] };
        r.panels = r.panels.length === 1 ? [...r.panels, { id: `p${Date.now()}`, type: 'new' }] : [r.panels[0]];
        next[i] = r; return next;
    });

    return (
        <Box className={classes.grid}>
            <Group justify="space-between" px="md" mb="xs">
                <Text fw={800} size="xl" variant="gradient">Nexus</Text>
                <ActionIcon onClick={add} variant="light" color="yellow"><Plus size={18} /></ActionIcon>
            </Group>

            <Board
                rows={rows}
                onRowsChange={setRows}
                onRemovePanel={del}
                onToggleSlot={toggle}
                panelRegistry={panelRegistry}
            />
        </Box>
    );
}