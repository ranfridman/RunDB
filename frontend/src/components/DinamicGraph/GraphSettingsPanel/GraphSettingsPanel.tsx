import { useState, useEffect, useContext } from 'react';
import { ActionIcon, Group, Paper, ScrollArea, Stack, Text, TextInput, Divider, Menu, UnstyledButton, Box } from '@mantine/core';
import { X, Info, PieChart as PieChartIcon, ChevronRight, BarChart3, AlignEndHorizontal, LineChart, Hash, ArrowUpFromLine, Layers, Maximize2, GitMerge, Minus, Grid3x3, Palette, Hexagon, PanelLeftRightDashed, Pencil } from 'lucide-react';
import { ChartConfig, ChartType } from './types';
import { Panel, PanelActionsContext } from '../../Dashboard/Board/types';
import { DataColorsTab } from './DataColorsTab';
import { SettingsTab } from './SettingsTab';
import { MenuRow, MenuRowCustom } from './Primitives';
import { ReferenceLinesTab } from './ReferenceLinesTab';

interface GraphSettingsPanelProps {
    panel?: Panel;
    chartType: ChartType;
    setChartType: (type: ChartType) => void;
    config: ChartConfig;
    setConfig: (updater: (prev: ChartConfig) => ChartConfig) => void;
    onClose: () => void;
    availableKeys: string[];
}

const icons: Record<ChartType, React.FC<any>> = {
    bar: BarChart3,
    area: AlignEndHorizontal,
    line: LineChart,
    pie: PieChartIcon,
    scatter: Hash,
    heatmap: Grid3x3,
    radar: Hexagon,
};


export const GraphSettingsPanel = ({ panel, chartType, setChartType, config, setConfig, onClose, availableKeys }: GraphSettingsPanelProps) => {
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const actions = useContext(PanelActionsContext);

    return (
        <Paper
            p={0}
            onMouseDown={(e) => e.stopPropagation()}
            withBorder
            style={{
                width: 300,
                maxHeight: 500,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <ScrollArea.Autosize scrollbars="y" mah="100%" p="xs" offsetScrollbars scrollbarSize={2}>
                <Stack gap="5">
                    {/* Header */}
                    <Group justify="space-between" align="center" >
                        <Text fw={600} size="sm">View settings</Text>
                        <ActionIcon size="xs" variant="subtle" onClick={onClose} color="gray" radius="xl">
                            <X size={14} />
                        </ActionIcon>
                    </Group>

                    <Divider opacity={0.5} />
                    <EditButton
                        onClick={() => {
                            if (panel?.id) {
                                actions?.updatePanel(panel.id, { type: 'new' });
                                onClose();
                            }
                        }}
                    />
                    <Divider opacity={0.5} />

                    {/* Layout Section */}
                    {/* <Group justify="space-between" align="center" style={{ cursor: 'pointer' }}>
                        <Group gap={8}>
                            <PieChartIcon size={16} color="var(--mantine-color-dimmed)" />
                            <Text size="sm" fw={500}>Layout</Text>
                        </Group>
                        <Group gap={2}>
                            <Text size="sm" c="dimmed">Chart</Text>
                            <ChevronRight size={14} color="var(--mantine-color-gray-4)" />
                        </Group>
                    </Group> */}

                    {/* Chart Type Selection */}
                    <Stack gap={8}>
                        <Text size="xs" fw={500} c="dimmed">Chart type</Text>
                        <Group gap={8} justify='space-'>
                            {(['bar', 'area', 'line', 'pie', 'scatter', 'heatmap', 'radar'] as ChartType[]).map(type => {
                                const IconComp = icons[type];
                                const isSelected = chartType === type;
                                return (
                                    <ActionIcon
                                        key={type}
                                        size="md"
                                        radius="sm"
                                        variant={isSelected ? "light" : "default"}
                                        color={isSelected ? "blue" : "gray"}
                                        onClick={() => setChartType(type)}
                                        style={{
                                            borderWidth: isSelected ? 2 : 1,
                                            borderColor: isSelected ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-gray-3)',
                                        }}
                                    >
                                        <IconComp size={16} strokeWidth={isSelected ? 2.5 : 2} style={{ color: isSelected ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-gray-5)' }} />
                                    </ActionIcon>
                                )
                            })}
                        </Group>
                    </Stack>

                    {/* X Axis Properties */}
                    <Stack gap={2} mt="md">
                        <Text size="xs" fw={500} c="dimmed" mb={4}>X axis</Text>
                        <MenuRow
                            icon={ArrowUpFromLine}
                            label="Axis Values"
                            value={config.xAxisKey}
                            options={availableKeys}
                            onSelect={(val: string) => setConfig(p => ({ ...p, xAxisKey: val }))}
                            opened={openSubMenu === 'x-axis'}
                            onOpenChange={(o: boolean) => setOpenSubMenu(o ? 'x-axis' : null)}
                        />
                        <MenuRow
                            icon={PanelLeftRightDashed}
                            label="Background Grid"
                            value={config.gridAxis !== 'none' ? config.gridAxis : 'None'}
                            options={['none', 'x', 'y', 'xy']}
                            onSelect={(val: string) => setConfig(p => ({ ...p, gridAxis: val as any }))}
                            opened={openSubMenu === 'group-by'}
                            onOpenChange={(o: boolean) => setOpenSubMenu(o ? 'group-by' : null)}
                        />
                        {/* <MenuRow icon={GitMerge} label="Sub-tasks" /> */}
                        <MenuRowCustom
                            icon={Minus}
                            label="Reference line"
                            value={`${config.referenceLines?.length || 0} lines`}
                            opened={openSubMenu === 'ref-lines'}
                            onOpenChange={(o: boolean) => setOpenSubMenu(o ? 'ref-lines' : null)}
                        >
                            <ReferenceLinesTab
                                chartType={chartType}
                                setChartType={setChartType}
                                config={config}
                                setConfig={setConfig}
                            />
                        </MenuRowCustom>
                    </Stack>

                    {/* Data / Colors */}
                    <Stack gap={2} mt="xs">
                        <Text size="xs" fw={500} c="dimmed" mb={4}>Data</Text>
                        <MenuRowCustom
                            icon={Palette}
                            label="Metrics & Colors"
                            value={`${config.yAxisKeys.length} active`}
                            opened={openSubMenu === 'y-metrics' || (openSubMenu && availableKeys.includes(openSubMenu))}
                            onOpenChange={(o: boolean) => setOpenSubMenu(o ? 'y-metrics' : null)}
                        >
                            <Box p="xs" style={{ width: 250 }}>
                                <DataColorsTab
                                    chartType={chartType}
                                    setChartType={setChartType}
                                    config={config}
                                    setConfig={setConfig}
                                    availableKeys={availableKeys}
                                    openKey={openSubMenu}
                                    setOpenKey={setOpenSubMenu}
                                />
                            </Box>
                        </MenuRowCustom>
                        {/* <Divider opacity={0.5} mx="-sm" mt="sm" /> */}
                    </Stack>


                    <Stack gap={2} mt="xs" mb="sm">
                        <Text size="xs" fw={500} c="dimmed" mb={4}>Chart options</Text>
                        <SettingsTab chartType={chartType} setChartType={setChartType} config={config} setConfig={setConfig} openKey={openSubMenu} setOpenKey={setOpenSubMenu} />
                    </Stack>

                </Stack>
            </ScrollArea.Autosize>
        </Paper>
    );
};

const EditButton = ({ onClick }: { onClick: () => void }) => {
    const [hover, setHover] = useState(false);
    return (
        <UnstyledButton
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 4,
                background: hover ? 'light-dark(rgba(0,0,0,0.03), rgba(255,255,255,0.05))' : 'transparent',
                transition: 'background 0.1s'
            }}
        >
            <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap={8} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <Pencil size={14} style={{ color: 'var(--mantine-color-blue-5)', flexShrink: 0 }} />
                    <Text size="xs" fw={400} truncate="end" style={{ color: 'var(--mantine-color-blue-6)' }}>Edit source data</Text>
                </Group>
                <ChevronRight size={14} style={{ color: 'var(--mantine-color-blue-2)', flexShrink: 0 }} />
            </Group>
        </UnstyledButton>
    );
};
