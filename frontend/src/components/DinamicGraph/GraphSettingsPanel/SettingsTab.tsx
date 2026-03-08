import { Stack, Text, Slider, Group } from '@mantine/core';
import { TabProps, CHART_SUPPORTED_PROPS } from './types';
import { PillGroup, ToggleRow } from './Primitives';

export const SettingsTab = ({ chartType, setChartType, config, setConfig }: TabProps) => {
    const isPie = chartType === 'pie';
    const supportedProps = CHART_SUPPORTED_PROPS[chartType];

    return (
        <Stack gap={10} mt="sm">
            <Stack gap={3}>
                <Text size="xs" c="dimmed" fw={500}>Chart</Text>
                <PillGroup
                    value={chartType}
                    onChange={v => setChartType(v as any)}
                    options={['area', 'bar', 'line', 'scatter', 'pie']}
                />
            </Stack>


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

            {supportedProps.includes('tooltipDataSource') && (
                <Stack gap={3}>
                    <Text size="xs" c="dimmed" fw={500}>Source</Text>
                    <PillGroup
                        value={config.tooltipDataSource}
                        onChange={val => setConfig(p => ({ ...p, tooltipDataSource: val as any }))}
                        options={['segment', 'all']}
                    />
                </Stack>
            )}
        </Stack>
    );
};
