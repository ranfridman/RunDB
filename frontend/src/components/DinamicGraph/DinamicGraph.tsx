import { useState } from 'react';
import {
    Box,
    Text,
    Group,
    Stack,
    ActionIcon,
    Center,
    ThemeIcon,
    Tooltip,
} from '@mantine/core';
import { Settings, BarChart2 } from 'lucide-react';
import '@mantine/charts/styles.css';

import { ChartConfig, ChartType, CHART_SUPPORTED_PROPS } from './GraphSettingsPanel/types';
import { GraphSettingsPanel } from './GraphSettingsPanel/GraphSettingsPanel';
import { ChartErrorBoundary } from './ChartErrorBoundary';
import { data } from './mockData';
import { CHART_COMPONENTS, CHART_ICONS, DEFAULT_COLORS } from './constants';

export const DinamicGraph = () => {
    const [chartType, setChartType] = useState<ChartType>('area');
    const [showOptions, setShowOptions] = useState(false);

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
            tooltipDataSource: 'segment',
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
        h: '100%',
        w: '100%',
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

    if (chartType === 'pie') {
        const latestData = data[data.length - 1] as any;
        chartProps.data = series.map((s) => ({
            name: s.name,
            value: latestData[s.name],
            color: s.color,
        }));
        chartProps.tooltipDataSource = config.tooltipDataSource;
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
                const rawX = d[config.xAxisKey];
                const xVal = typeof rawX === 'number' ? rawX : (parseFloat(rawX) || rawX);
                return {
                    x: xVal,
                    y: typeof d[s.name] === 'number' ? d[s.name] : (parseFloat(d[s.name]) || d[s.name]),
                    name: rawX,
                };
            }),
        }));
        chartProps.dataKey = { x: 'x', y: 'y' };
        delete chartProps.series;
    }

    CHART_SUPPORTED_PROPS[chartType].forEach(prop => {
        chartProps[prop] = config[prop as keyof ChartConfig];
    });
    const ChartComponent = CHART_COMPONENTS[chartType];
    return (
        <Box
            style={{ height: '100%', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}
            tabIndex={-1}
        >
            {!showOptions && (
                <ActionIcon
                    size="md"
                    variant="subtle"
                    onClick={() => setShowOptions(true)}
                    style={{
                        position: 'absolute',
                        top: 3,
                        left: 10,
                        zIndex: 25,
                        backgroundColor: 'light-dark(rgba(0,0,0,0.05), rgba(255,255,255,0.05))',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        color: 'inherit'
                    }}
                >
                    <Settings size={18} />
                </ActionIcon>
            )}

            <ChartErrorBoundary key={`${chartType}-${config.xAxisKey}-${config.yAxisKeys.join(',')}`}>
                {series.length === 0 ? (
                    <Center style={{ height: '100%', flex: 1 }}>
                        <Stack align="center" gap="xs" style={{ opacity: 0.4 }}>
                            <ThemeIcon variant="light" color="gray" size="xl" radius="xl">
                                <BarChart2 size={20} />
                            </ThemeIcon>
                            <Text size="xs" c="dimmed">Select at least one Y-axis series</Text>
                        </Stack>
                    </Center>
                ) : (
                    <ChartComponent {...chartProps} />
                )}
            </ChartErrorBoundary>

            {showOptions && (
                <GraphSettingsPanel
                    chartType={chartType}
                    setChartType={setChartType}
                    config={config}
                    setConfig={setConfig}
                    onClose={() => setShowOptions(false)}
                    availableKeys={availableKeys}
                />
            )}
        </Box>
    );
};