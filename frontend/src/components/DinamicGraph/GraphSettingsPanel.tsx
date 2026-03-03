import { ActionIcon, Checkbox, Group, Paper, ScrollArea, SegmentedControl, Select, Stack, Text, Tabs, ColorSwatch, CheckIcon, Menu, SimpleGrid, Slider } from '@mantine/core';
import { X, Palette, Info, Settings2 } from 'lucide-react';

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
    seriesColors: Record<string, string>;
}

export const CHART_SUPPORTED_PROPS: Record<ChartType, (keyof ChartConfig)[]> = {
    area: ['type', 'curveType', 'strokeWidth', 'withGradient', 'withDots'],
    bar: ['type'],
    line: ['curveType', 'strokeWidth', 'withDots'],
    scatter: [],
    pie: ['withLabels', 'labelsType', 'strokeWidth'],
};

// --- Tab Components ---

interface TabProps {
    chartType: ChartType;
    config: ChartConfig;
    setConfig: (updater: (prev: ChartConfig) => ChartConfig) => void;
}

const PRESET_COLORS = [
    '#228be6', '#15aabf', '#0ca678', '#40c057', '#82c91e', '#fab005', '#fd7e14', '#fa5252', '#e64980', '#be4bdb',
    '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#0ca678', '#40c057', '#82c91e', '#fab005', '#fd7e14', '#fa5252',
];

const ColorsTab = ({ config, setConfig }: TabProps) => (
    <Stack gap="sm" mt="sm">
        {Object.entries(config.seriesColors || {}).map(([key, color]) => (
            <Group key={key} justify="space-between" align="center" wrap="nowrap">
                <Text size="xs" fw={500} truncate style={{ flex: 1 }}>{key}</Text>

                <Menu shadow="md" width={200} position="bottom-end" withinPortal>
                    <Menu.Target>
                        <ActionIcon variant="transparent">
                            <ColorSwatch
                                color={color}
                                size={22}
                                style={{ cursor: 'pointer', border: '1px solid var(--mantine-color-default-border)' }}
                            />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown p="xs">
                        <Text size="xs" fw={700} c="dimmed" mb="xs">SELECT COLOR</Text>
                        <SimpleGrid cols={5} spacing="xs">
                            {PRESET_COLORS.map((presetColor) => (
                                <ColorSwatch
                                    key={presetColor}
                                    color={presetColor}
                                    size={24}
                                    style={{ cursor: 'pointer', color: '#fff' }}
                                    onClick={() => setConfig((p) => ({
                                        ...p,
                                        seriesColors: { ...p.seriesColors, [key]: presetColor }
                                    }))}
                                >
                                    {color === presetColor && <CheckIcon width={12} />}
                                </ColorSwatch>
                            ))}
                        </SimpleGrid>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        ))}
    </Stack>
);

const SettingsTab = ({ chartType, config, setConfig }: TabProps) => {
    const isPie = chartType === 'pie';
    const supportedProps = CHART_SUPPORTED_PROPS[chartType];

    return (
        <Stack gap="md" mt="sm">
            {!isPie && (
                <>
                    <Stack gap={4}>
                        <Text size="xs" fw={500}>Tick line</Text>
                        <SegmentedControl
                            size="xs"
                            value={config.tickLine}
                            onChange={(val) => setConfig(p => ({ ...p, tickLine: val as any }))}
                            data={['x', 'y', 'xy', 'none']}
                            fullWidth
                        />
                    </Stack>

                    <Stack gap={4}>
                        <Text size="xs" fw={500}>Grid axis</Text>
                        <SegmentedControl
                            size="xs"
                            value={config.gridAxis}
                            onChange={(val) => setConfig(p => ({ ...p, gridAxis: val as any }))}
                            data={['x', 'y', 'xy', 'none']}
                            fullWidth
                        />
                    </Stack>

                    <Stack gap="xs">
                        <Group grow>
                            <Checkbox
                                label="X Axis"
                                size="xs"
                                checked={config.withXAxis}
                                onChange={(e) => setConfig(p => ({ ...p, withXAxis: e.currentTarget.checked }))}
                            />
                            <Checkbox
                                label="Y Axis"
                                size="xs"
                                checked={config.withYAxis}
                                onChange={(e) => setConfig(p => ({ ...p, withYAxis: e.currentTarget.checked }))}
                            />
                        </Group>
                    </Stack>
                </>
            )}

            <Stack gap="xs">
                <Group grow>
                    <Checkbox
                        label="Tooltip"
                        size="xs"
                        checked={config.withTooltip}
                        onChange={(e) => setConfig(p => ({ ...p, withTooltip: e.currentTarget.checked }))}
                    />
                    {!isPie && (
                        <Checkbox
                            label="Legend"
                            size="xs"
                            checked={config.withLegend}
                            onChange={(e) => setConfig(p => ({ ...p, withLegend: e.currentTarget.checked }))}
                        />
                    )}
                </Group>
            </Stack>

            {supportedProps.includes('type') && (
                <Stack gap={4}>
                    <Text size="xs" fw={500}>Stacking Type</Text>
                    <SegmentedControl
                        size="xs"
                        value={config.type}
                        onChange={(val) => setConfig(p => ({ ...p, type: val as any }))}
                        data={['default', 'stacked', 'percent']}
                        fullWidth
                    />
                </Stack>
            )}

            {supportedProps.includes('curveType') && (
                <Select
                    label="Curve type"
                    size="xs"
                    value={config.curveType}
                    onChange={(val) => setConfig(p => ({ ...p, curveType: val as any }))}
                    data={['linear', 'monotone', 'step']}
                />
            )}

            {supportedProps.includes('strokeWidth') && (
                <Stack gap={4}>
                    <Group justify="space-between">
                        <Text size="xs" fw={500}>Stroke Width</Text>
                        <Text size="xs" c="dimmed">{config.strokeWidth}px</Text>
                    </Group>
                    <Slider
                        size="xs"
                        min={0}
                        max={10}
                        step={1}
                        value={config.strokeWidth}
                        onChange={(val) => setConfig(p => ({ ...p, strokeWidth: val }))}
                    />
                </Stack>
            )}

            <Stack gap="xs">
                {supportedProps.includes('withGradient') && (
                    <Checkbox
                        label="With gradient"
                        size="xs"
                        checked={config.withGradient}
                        onChange={(e) => setConfig(p => ({ ...p, withGradient: e.currentTarget.checked }))}
                    />
                )}

                {supportedProps.includes('withDots') && (
                    <Checkbox
                        label="With dots"
                        size="xs"
                        checked={config.withDots}
                        onChange={(e) => setConfig(p => ({ ...p, withDots: e.currentTarget.checked }))}
                    />
                )}

                {supportedProps.includes('withLabels') && (
                    <Stack gap="xs">
                        <Checkbox
                            label="With labels"
                            size="xs"
                            checked={config.withLabels}
                            onChange={(e) => setConfig(p => ({ ...p, withLabels: e.currentTarget.checked }))}
                        />
                        {supportedProps.includes('labelsType') && config.withLabels && (
                            <SegmentedControl
                                size="xs"
                                value={config.labelsType}
                                onChange={(val) => setConfig(p => ({ ...p, labelsType: val as any }))}
                                data={['value', 'percent']}
                                fullWidth
                            />
                        )}
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};

// --- Main Panel Component ---

interface GraphSettingsPanelProps {
    chartType: ChartType;
    config: ChartConfig;
    setConfig: (updater: (prev: ChartConfig) => ChartConfig) => void;
    onClose: () => void;
}

export const GraphSettingsPanel = ({ chartType, config, setConfig, onClose }: GraphSettingsPanelProps) => {
    return (
        <Paper
            shadow="md"
            p={0}
            withBorder
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: 320, // Increased slightly to accommodate tabs nicely
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderTop: 0,
                borderRight: 0,
                borderBottom: 0,
            }}
        >
            <ScrollArea.Autosize mah="100%" p="md">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Text size="xs" fw={700} c="dimmed">SETTINGS</Text>
                        <ActionIcon size="xs" variant="subtle" onClick={onClose}>
                            <X size={14} />
                        </ActionIcon>
                    </Group>

                    <Tabs defaultValue="colors" color="dark">
                        <Tabs.List grow>
                            <Tabs.Tab value="colors" leftSection={<Palette size={14} />}>
                                Colors
                            </Tabs.Tab>
                            <Tabs.Tab value="settings" leftSection={<Settings2 size={14} />}>
                                Settings
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="colors">
                            <ColorsTab chartType={chartType} config={config} setConfig={setConfig} />
                        </Tabs.Panel>

                        <Tabs.Panel value="settings">
                            <SettingsTab chartType={chartType} config={config} setConfig={setConfig} />
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </ScrollArea.Autosize>
        </Paper>
    );
};
