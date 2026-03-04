import { useState } from 'react';
import {
    ActionIcon, Group, Paper, ScrollArea,
    Stack, Text, Tabs,
    ColorSwatch, CheckIcon, Menu, SimpleGrid, Slider, Tooltip, Box, Switch,
} from '@mantine/core';
import { X, Settings2, ArrowLeftRight } from 'lucide-react';

// --- Shared UI primitives ---

/** Pill-button segmented control */
const PillGroup = ({ value, onChange, options }: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) => (
    <Group gap={3} style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 3,
        border: '1px solid rgba(255,255,255,0.08)',
    }}>
        {options.map(opt => {
            const active = value === opt;
            return (
                <Box
                    key={opt}
                    onClick={() => onChange(opt)}
                    style={{
                        flex: 1, textAlign: 'center',
                        padding: '3px 0',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: active ? 700 : 400,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.15s',
                        color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                        background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.25)' : 'none',
                        letterSpacing: active ? '0.01em' : '0',
                    }}
                >
                    {opt}
                </Box>
            );
        })}
    </Group>
);

/** Label + switch toggle row */
const ToggleRow = ({ label, checked, onChange }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <Group justify="space-between" align="center" wrap="nowrap" style={{ padding: '1px 0' }}>
        <Text size="xs" c={checked ? undefined : 'dimmed'} fw={checked ? 500 : 400}
            style={{ transition: 'color 0.15s' }}>
            {label}
        </Text>
        <Switch
            size="xs"
            checked={checked}
            onChange={e => onChange(e.currentTarget.checked)}
            styles={{
                track: { cursor: 'pointer' },
            }}
        />
    </Group>
);

export type ChartType = 'area' | 'bar' | 'line' | 'scatter' | 'pie';

export interface ChartConfig {
    withTooltip: boolean;
    withLegend: boolean;
    gridAxis: 'xy' | 'x' | 'y' | 'none';
    tickLine: 'xy' | 'x' | 'y' | 'none';
    type: 'default' | 'stacked' | 'percent';
    curveType: 'linear' | 'monotone' | 'step';
    strokeWidth: number;
    withGradient: boolean;
    withXAxis: boolean;
    withYAxis: boolean;
    withDots: boolean;
    withLabels: boolean;
    labelsType: 'value' | 'percent';
    xAxisKey: string;
    yAxisKeys: string[];
    seriesColors: Record<string, string>;
}

export const CHART_SUPPORTED_PROPS: Record<ChartType, (keyof ChartConfig)[]> = {
    area: ['type', 'curveType', 'strokeWidth', 'withGradient', 'withDots'],
    bar: ['type'],
    line: ['curveType', 'strokeWidth', 'withDots'],
    scatter: [],
    pie: ['withLabels', 'labelsType', 'strokeWidth'],
};

interface TabProps {
    chartType: ChartType;
    config: ChartConfig;
    setConfig: (updater: (prev: ChartConfig) => ChartConfig) => void;
}

const PRESET_COLORS = [
    '#228be6', '#15aabf', '#0ca678', '#40c057', '#82c91e',
    '#fab005', '#fd7e14', '#fa5252', '#e64980', '#be4bdb',
    '#7950f2', '#4c6ef5', '#74c0fc', '#63e6be', '#ffd43b',
    '#ffa94d', '#ff8787', '#f783ac', '#da77f2', '#748ffc',
];

// --- Data Tab ---
const DataColorsTab = ({ config, setConfig, availableKeys }: TabProps & { availableKeys: string[] }) => {
    const promoteToX = (key: string) => {
        setConfig(prev => {
            const oldX = prev.xAxisKey;
            const newY = prev.yAxisKeys.filter(k => k !== key);
            if (oldX && !newY.includes(oldX)) newY.push(oldX);
            return { ...prev, xAxisKey: key, yAxisKeys: newY };
        });
    };

    const toggleY = (key: string, on: boolean) => {
        setConfig(p => ({
            ...p,
            yAxisKeys: on ? [...p.yAxisKeys, key] : p.yAxisKeys.filter(k => k !== key),
        }));
    };

    return (
        <Stack gap={4} mt={8}>
            {availableKeys.map(key => {
                const isX = config.xAxisKey === key;
                const isY = config.yAxisKeys.includes(key);
                const color = config.seriesColors?.[key] ?? '#228be6';

                return (
                    <Group key={key} gap={6} align="center" wrap="nowrap" style={{ padding: '4px 2px' }}>
                        {/* Color dot — opens picker for Y-series */}
                        {isY ? (
                            <Menu shadow="md" width={216} position="bottom-start" withinPortal>
                                <Menu.Target>
                                    <Box
                                        style={{
                                            width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                                            background: color, cursor: 'pointer',
                                            boxShadow: `0 0 0 2px ${color}40`,
                                        }}
                                    />
                                </Menu.Target>
                                <Menu.Dropdown p="sm">
                                    <Text size="xs" fw={600} c="dimmed" mb={7} style={{ letterSpacing: '0.05em' }}>COLOR</Text>
                                    <SimpleGrid cols={5} spacing={5}>
                                        {PRESET_COLORS.map(pc => (
                                            <Tooltip key={pc} label={pc} fz={10} withArrow>
                                                <ColorSwatch
                                                    color={pc} size={26}
                                                    style={{ cursor: 'pointer', borderRadius: 5 }}
                                                    onClick={() => setConfig(p => ({ ...p, seriesColors: { ...p.seriesColors, [key]: pc } }))}
                                                >
                                                    {color === pc && <CheckIcon width={9} />}
                                                </ColorSwatch>
                                            </Tooltip>
                                        ))}
                                    </SimpleGrid>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Box
                                style={{
                                    width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                                    background: isX ? '#63e6be' : 'rgba(255,255,255,0.12)',
                                    boxShadow: isX ? '0 0 0 2px rgba(99,230,190,0.3)' : 'none',
                                }}
                            />
                        )}

                        {/* Key name */}
                        <Text
                            size="xs"
                            fw={isX || isY ? 600 : 400}
                            c={isX ? 'teal' : isY ? undefined : 'dimmed'}
                            truncate
                            style={{ flex: 1 }}
                        >
                            {key}
                        </Text>

                        {/* X pill — click any non-X row to promote it */}
                        <Tooltip label={isX ? 'X axis' : 'Set as X axis'} position="top" withArrow fz="xs">
                            <Box
                                onClick={() => !isX && promoteToX(key)}
                                style={{
                                    fontSize: 10, fontWeight: 700, lineHeight: 1,
                                    padding: '2px 6px', borderRadius: 4,
                                    cursor: isX ? 'default' : 'pointer',
                                    userSelect: 'none',
                                    color: isX ? '#63e6be' : 'rgba(255,255,255,0.2)',
                                    border: `1px solid ${isX ? 'rgba(99,230,190,0.4)' : 'rgba(255,255,255,0.1)'}`,
                                    background: isX ? 'rgba(99,230,190,0.1)' : 'transparent',
                                    transition: 'all 0.15s',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => { if (!isX) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                                onMouseLeave={e => { if (!isX) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)'; }}
                            >
                                X
                            </Box>
                        </Tooltip>

                        {/* Y toggle — hidden for X axis */}
                        {!isX && (
                            <Switch
                                size="xs"
                                checked={isY}
                                onChange={e => toggleY(key, e.currentTarget.checked)}
                                color={color}
                            />
                        )}
                        {isX && <Box style={{ width: 32 }} />}
                    </Group>
                );
            })}
        </Stack>
    );
};

// --- Settings Tab ---
const SettingsTab = ({ chartType, config, setConfig }: TabProps) => {
    const isPie = chartType === 'pie';
    const supportedProps = CHART_SUPPORTED_PROPS[chartType];

    return (
        <Stack gap={10} mt="sm">
            {!isPie && (
                <>
                    <Stack gap={3}>
                        <Text size="xs" c="dimmed" fw={500}>Tick line</Text>
                        <PillGroup
                            value={config.tickLine}
                            onChange={val => setConfig(p => ({ ...p, tickLine: val as any }))}
                            options={['x', 'y', 'xy', 'none']}
                        />
                    </Stack>
                    <Stack gap={3}>
                        <Text size="xs" c="dimmed" fw={500}>Grid axis</Text>
                        <PillGroup
                            value={config.gridAxis}
                            onChange={val => setConfig(p => ({ ...p, gridAxis: val as any }))}
                            options={['x', 'y', 'xy', 'none']}
                        />
                    </Stack>
                    <ToggleRow label="Show X axis" checked={config.withXAxis}
                        onChange={v => setConfig(p => ({ ...p, withXAxis: v }))} />
                    <ToggleRow label="Show Y axis" checked={config.withYAxis}
                        onChange={v => setConfig(p => ({ ...p, withYAxis: v }))} />
                </>
            )}

            <ToggleRow label="Tooltip" checked={config.withTooltip}
                onChange={v => setConfig(p => ({ ...p, withTooltip: v }))} />
            {!isPie && (
                <ToggleRow label="Legend" checked={config.withLegend}
                    onChange={v => setConfig(p => ({ ...p, withLegend: v }))} />
            )}

            {supportedProps.includes('type') && (
                <Stack gap={3}>
                    <Text size="xs" c="dimmed" fw={500}>Type</Text>
                    <PillGroup
                        value={config.type}
                        onChange={val => setConfig(p => ({ ...p, type: val as any }))}
                        options={['default', 'stacked', 'percent']}
                    />
                </Stack>
            )}

            {supportedProps.includes('curveType') && (
                <Stack gap={3}>
                    <Text size="xs" c="dimmed" fw={500}>Curve</Text>
                    <PillGroup
                        value={config.curveType}
                        onChange={val => setConfig(p => ({ ...p, curveType: val as any }))}
                        options={['linear', 'monotone', 'step']}
                    />
                </Stack>
            )}

            {supportedProps.includes('strokeWidth') && (
                <Stack gap={4}>
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed" fw={500}>Stroke</Text>
                        <Text size="xs" c="dimmed">{config.strokeWidth}px</Text>
                    </Group>
                    <Slider size="xs" min={0} max={10} step={1} value={config.strokeWidth}
                        onChange={val => setConfig(p => ({ ...p, strokeWidth: val }))} />
                </Stack>
            )}

            {supportedProps.includes('withGradient') && (
                <ToggleRow label="Gradient" checked={config.withGradient}
                    onChange={v => setConfig(p => ({ ...p, withGradient: v }))} />
            )}
            {supportedProps.includes('withDots') && (
                <ToggleRow label="Dots" checked={config.withDots}
                    onChange={v => setConfig(p => ({ ...p, withDots: v }))} />
            )}
            {supportedProps.includes('withLabels') && (
                <Stack gap={6}>
                    <ToggleRow label="Labels" checked={config.withLabels}
                        onChange={v => setConfig(p => ({ ...p, withLabels: v }))} />
                    {config.withLabels && (
                        <PillGroup
                            value={config.labelsType}
                            onChange={val => setConfig(p => ({ ...p, labelsType: val as any }))}
                            options={['value', 'percent']}
                        />
                    )}
                </Stack>
            )}
        </Stack>
    );
};

// --- Main Panel ---
interface GraphSettingsPanelProps {
    chartType: ChartType;
    config: ChartConfig;
    setConfig: (updater: (prev: ChartConfig) => ChartConfig) => void;
    onClose: () => void;
    availableKeys: string[];
}

export const GraphSettingsPanel = ({ chartType, config, setConfig, onClose, availableKeys }: GraphSettingsPanelProps) => (
    <Paper
        shadow="md" p={0} withBorder
        style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 260, zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderTop: 0, borderRight: 0, borderBottom: 0,
        }}
    >
        <ScrollArea.Autosize mah="100%" p="sm">
            <Stack gap="sm">
                <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.08em' }}>SETTINGS</Text>
                    <ActionIcon size="xs" variant="subtle" onClick={onClose}>
                        <X size={14} />
                    </ActionIcon>
                </Group>

                <Tabs defaultValue="data" color="dark">
                    <Tabs.List grow>
                        <Tabs.Tab value="data" leftSection={<ArrowLeftRight size={12} />}>Data</Tabs.Tab>
                        <Tabs.Tab value="settings" leftSection={<Settings2 size={12} />}>Settings</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="data">
                        <DataColorsTab chartType={chartType} config={config} setConfig={setConfig} availableKeys={availableKeys} />
                    </Tabs.Panel>
                    <Tabs.Panel value="settings">
                        <SettingsTab chartType={chartType} config={config} setConfig={setConfig} />
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </ScrollArea.Autosize>
    </Paper>
);
