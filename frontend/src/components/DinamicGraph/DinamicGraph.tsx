import { useState, useEffect, memo, useContext } from 'react';
import ReactDOM from 'react-dom';
import {
    Box,
    Text,
    Group,
    Stack,
    ActionIcon,
    Center,
    ThemeIcon,
    Tooltip,
    Popover,
} from '@mantine/core';
import { BarChart2, Settings2 } from 'lucide-react';
import '@mantine/charts/styles.css';

import { ChartConfig, ChartType, CHART_SUPPORTED_PROPS } from './GraphSettingsPanel/types';
import { GraphSettingsPanel } from './GraphSettingsPanel/GraphSettingsPanel';
import { ChartErrorBoundary } from './ChartErrorBoundary';
import { CHART_COMPONENTS, CHART_ICONS, DEFAULT_COLORS } from './constants';
import { Panel, PanelActionsContext } from '../Dashboard/Board/types';

export const DinamicGraph = memo(({ panel, headerRef, data = [] }: { panel?: Panel, headerRef?: HTMLElement | null, data?: any[] }) => {
    const actions = useContext(PanelActionsContext);
    const isEditMode = actions?.isEditMode ?? false;
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

    // Update config when data keys change (e.g. when data is first loaded or changed)
    useEffect(() => {
        if (data.length > 0) {
            const currentKeys = Object.keys(data[0]);
            const hasNewKeys = currentKeys.some(key => !config.yAxisKeys.includes(key) && key !== config.xAxisKey);
            
            if (hasNewKeys) {
                const newColors = { ...config.seriesColors };
                currentKeys.forEach((key, index) => {
                    if (!newColors[key]) {
                        newColors[key] = DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                    }
                });

                setConfig(prev => ({
                    ...prev,
                    yAxisKeys: currentKeys.filter(key => key !== prev.xAxisKey),
                    seriesColors: newColors
                }));
            }
        }
    }, [data]);

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
        const latestData = (data[data.length - 1] || {}) as any;
        chartProps.data = series.map((s) => ({
            name: s.name,
            value: latestData[s.name] || 0,
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
    } else if (chartType === 'heatmap') {
        chartProps.data = data;
        chartProps.xAxisKey = config.xAxisKey;
        chartProps.yAxisKeys = config.yAxisKeys;

        delete chartProps.series;
        delete chartProps.dataKey;
        delete chartProps.withLegend;
        delete chartProps.gridAxis;
        delete chartProps.tickLine;
        delete chartProps.withXAxis;
        delete chartProps.withYAxis;
    }

    CHART_SUPPORTED_PROPS[chartType].forEach(prop => {
        chartProps[prop] = config[prop as keyof ChartConfig];
    });
    const ChartComponent = CHART_COMPONENTS[chartType];
    const settingsElement = (
        <Popover width={300} position="bottom-end" shadow="md" keepMounted opened={showOptions} onChange={setShowOptions} trapFocus={false}>
            <Popover.Target>
                <div onPointerDown={(e) => e.stopPropagation()}>
                    <Tooltip label="Chart settings" position="top" withArrow>
                        <ActionIcon
                            size="sm"
                            variant='subtle'
                            color='gray'
                            onClick={() => setShowOptions((o) => !o)}
                        >
                            <Settings2 size={16} />
                        </ActionIcon>
                    </Tooltip>
                </div>
            </Popover.Target>
            <Popover.Dropdown p={0}>
                <GraphSettingsPanel
                    panel={panel}
                    chartType={chartType}
                    setChartType={setChartType}
                    config={config}
                    setConfig={setConfig}
                    onClose={() => setShowOptions(false)}
                    availableKeys={availableKeys}
                />
            </Popover.Dropdown>
        </Popover>
    );

    return (
        <Box
            style={{ height: '100%', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}
            tabIndex={-1}
        >
            {isEditMode && (
                headerRef ? ReactDOM.createPortal(settingsElement, headerRef) : (
                    <Box pos="absolute" top={3} right={10} style={{ zIndex: 25 }}>
                        {settingsElement}
                    </Box>
                )
            )}

            <ChartErrorBoundary key={`${chartType}-${config.xAxisKey}-${(config.yAxisKeys || []).join(',')}`}>
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
        </Box>
    );
});
