import { useState } from 'react';
import { AreaChart, BarChart, LineChart, ScatterChart, PieChart } from '@mantine/charts';
import {
    Box,
    Text,
    Group,
    Stack,
    SegmentedControl,
    ActionIcon,
} from '@mantine/core';
import { Settings, ChartArea, ChartBar, ChartLine, ChartPie, ChartScatter, X } from 'lucide-react';
import '@mantine/charts/styles.css';
import { ChartConfig, ChartType, GraphSettingsPanel, CHART_SUPPORTED_PROPS } from './GraphSettingsPanel';

const data = [
    { date: 'Mar 15', Apples: 1200, Oranges: 3800, Tomatoes: 500 },
    { date: 'Mar 16', Apples: 1450, Oranges: 3100, Tomatoes: 900 },
    { date: 'Mar 17', Apples: 4200, Oranges: 1800, Tomatoes: 1200 },
    { date: 'Mar 18', Apples: 3800, Oranges: 1200, Tomatoes: 2800 },
    { date: 'Mar 19', Apples: 1800, Oranges: 4500, Tomatoes: 3100 },
    { date: 'Mar 20', Apples: 1500, Oranges: 3900, Tomatoes: 4100 },
    { date: 'Mar 21', Apples: 800, Oranges: 2200, Tomatoes: 5200 },
    { date: 'Mar 22', Apples: 2890, Oranges: 1338, Tomatoes: 4452 },
    { date: 'Mar 23', Apples: 4756, Oranges: 803, Tomatoes: 3402 },
    { date: 'Mar 24', Apples: 5322, Oranges: 2986, Tomatoes: 1821 },
    { date: 'Mar 25', Apples: 2470, Oranges: 5108, Tomatoes: 809 },
    { date: 'Mar 26', Apples: 1129, Oranges: 4726, Tomatoes: 1290 },
    { date: 'Mar 27', Apples: 3200, Oranges: 2850, Tomatoes: 3150 },
    { date: 'Mar 28', Apples: 4500, Oranges: 1100, Tomatoes: 4600 },
];

const CHART_COMPONENTS = {
    area: AreaChart,
    bar: BarChart,
    line: LineChart,
    scatter: ScatterChart,
    pie: PieChart,
};

const CHART_ICONS = {
    area: { Icon: ChartArea, color: 'var(--mantine-color-yellow-6)' },
    bar: { Icon: ChartBar, color: 'var(--mantine-color-orange-6)' },
    line: { Icon: ChartLine, color: 'var(--mantine-color-red-6)' },
    scatter: { Icon: ChartScatter, color: 'var(--mantine-color-grape-6)' },
    pie: { Icon: ChartPie, color: 'var(--mantine-color-teal-6)' },
};

const DEFAULT_COLORS = [
    'var(--mantine-color-blue-6)',
    'var(--mantine-color-teal-6)',
    'var(--mantine-color-grape-6)',
    'var(--mantine-color-orange-6)',
    'var(--mantine-color-red-6)',
    'var(--mantine-color-pink-6)',
    'var(--mantine-color-cyan-6)',
    'var(--mantine-color-lime-6)',
    'var(--mantine-color-yellow-6)',
    'var(--mantine-color-indigo-6)',
];

export const DinamicGraph = () => {
    const [chartType, setChartType] = useState<ChartType>('area');
    const [showOptions, setShowOptions] = useState(false);

    // Dynamically extract data keys
    const availableKeys = Object.keys(data[0] || {});

    const [config, setConfig] = useState<ChartConfig>(() => {
        const initialColors = availableKeys.reduce((acc, key, index) => {
            acc[key] = DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return acc;
        }, {} as Record<string, string>);

        return {
            withTooltip: true,
            withLegend: false,
            gridAxis: 'x',
            tickLine: 'y',
            type: 'default',
            curveType: 'linear',
            strokeWidth: 2,
            withGradient: true,
            withXAxis: true,
            withYAxis: true,
            withDots: true,
            withLabels: true,
            labelsType: 'value',
            xAxisKey: 'date',
            yAxisKeys: availableKeys.filter(key => key !== 'date'),
            seriesColors: initialColors,
        };
    });

    const series = config.yAxisKeys.map((name) => ({
        name,
        color: config.seriesColors[name] || '#000',
    }));

    const chartProps: any = {
        h: 350,
        data,
        dataKey: config.xAxisKey,
        series,
        withTooltip: config.withTooltip,
        withLegend: config.withLegend,
        gridAxis: config.gridAxis,
        tickLine: config.tickLine,
        withXAxis: config.withXAxis,
        withYAxis: config.withYAxis,
    };

    // Special data mapping for PieChart and ScatterChart
    if (chartType === 'pie') {
        const latestData = data[data.length - 1] as any;
        chartProps.data = series.map((s) => ({
            name: s.name,
            value: latestData[s.name],
            color: s.color,
        }));
        delete chartProps.series;
        delete chartProps.dataKey;
        delete chartProps.gridAxis;
        delete chartProps.tickLine;
        delete chartProps.withXAxis;
        delete chartProps.withYAxis;
    } else if (chartType === 'scatter') {
        chartProps.data = series.map((s) => ({
            name: s.name,
            color: s.color,
            data: data.map((d: any) => {
                // Try to parse the X axis as a number for Scatter charts (e.g. if they chose Apples for X).
                // If it's a string like 'Mar 15', Scatter chart might still fail without numeric scales,
                // but we must respect the user's mapped column.
                const rawX = d[config.xAxisKey];
                const xVal = typeof rawX === 'number' ? rawX : (parseFloat(rawX) || rawX);
                return {
                    x: xVal,
                    y: typeof d[s.name] === 'number' ? d[s.name] : (parseFloat(d[s.name]) || d[s.name]),
                    name: rawX, // Store original for tooltip
                };
            }),
        }));
        chartProps.dataKey = { x: 'x', y: 'y' };
        delete chartProps.series;
    }

    CHART_SUPPORTED_PROPS[chartType].forEach(prop => {
        chartProps[prop] = config[prop as keyof ChartConfig];
    });

    const Chart = CHART_COMPONENTS[chartType];
    const { Icon, color: iconColor } = CHART_ICONS[chartType];

    return (
        <Stack gap="xs" style={{ height: '100%', width: '100%' }}>
            <Group justify="space-between" align="center">
                <Group gap="xs">
                    <Icon size={16} color={iconColor} />
                    <Text size="xs" fw={700} c="dimmed">ANALYTICS</Text>
                </Group>

                <Group gap="xs">
                    <SegmentedControl
                        size="xs"
                        value={chartType}
                        onChange={(val) => setChartType(val as ChartType)}
                        data={[
                            { label: 'Area', value: 'area' },
                            { label: 'Bar', value: 'bar' },
                            { label: 'Line', value: 'line' },
                            { label: 'Scatter', value: 'scatter' },
                            { label: 'Pie', value: 'pie' },
                        ]}
                    />
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={() => setShowOptions(!showOptions)}
                        c={showOptions ? 'yellow' : 'dimmed'}
                    >
                        <Settings size={14} />
                    </ActionIcon>
                </Group>
            </Group>

            <Box style={{ flex: 1, minHeight: 350, position: 'relative', overflow: 'hidden', outline: 'none' }} tabIndex={-1}>
                <Chart {...chartProps} />

                {showOptions && (
                    <GraphSettingsPanel
                        chartType={chartType}
                        config={config}
                        setConfig={setConfig}
                        onClose={() => setShowOptions(false)}
                        availableKeys={availableKeys}
                    />
                )}
            </Box>
        </Stack>
    );
};