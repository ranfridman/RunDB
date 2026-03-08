import { ActionIcon, Group, Paper, ScrollArea, Stack, Text, Tabs } from '@mantine/core';
import { X, Settings2, ArrowLeftRight } from 'lucide-react';
import { ChartConfig, ChartType } from './types';
import { DataColorsTab } from './DataColorsTab';
import { SettingsTab } from './SettingsTab';

interface GraphSettingsPanelProps {
    chartType: ChartType;
    setChartType: (type: ChartType) => void;
    config: ChartConfig;
    setConfig: (updater: (prev: ChartConfig) => ChartConfig) => void;
    onClose: () => void;
    availableKeys: string[];
}

export const GraphSettingsPanel = ({ chartType, setChartType, config, setConfig, onClose, availableKeys }: GraphSettingsPanelProps) => (
    <Paper
        shadow="md" p={0} withBorder
        style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 260, zIndex: 10,
            backgroundColor: 'light-dark(rgba(255, 255, 255, 0.8), rgba(18, 18, 18, 0.75))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: 0, borderLeft: 0, borderBottom: 0,
            borderRight: '1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.08))',
            boxShadow: '8px 0 24px rgba(0,0,0,0.15)',
        }}
    >
        <ScrollArea.Autosize mah="100%" p="sm" offsetScrollbars scrollbarSize={2}>
            <Stack gap="sm">
                <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.08em' }}>SETTINGS</Text>
                    <ActionIcon size="xs" variant="subtle" onClick={onClose}>
                        <X size={14} />
                    </ActionIcon>
                </Group>

                <Tabs defaultValue="data" color="dark">
                    <Tabs.List grow style={{ borderBottom: 'none' }}>
                        <Tabs.Tab value="data" leftSection={<ArrowLeftRight size={12} />}>Data</Tabs.Tab>
                        <Tabs.Tab value="settings" leftSection={<Settings2 size={12} />}>Settings</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="data">
                        <DataColorsTab chartType={chartType} setChartType={setChartType} config={config} setConfig={setConfig} availableKeys={availableKeys} />
                    </Tabs.Panel>
                    <Tabs.Panel value="settings">
                        <SettingsTab chartType={chartType} setChartType={setChartType} config={config} setConfig={setConfig} />
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </ScrollArea.Autosize>
    </Paper>
);
