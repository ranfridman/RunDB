export type ChartType = 'area' | 'bar' | 'line' | 'scatter' | 'pie' | 'heatmap' | 'radar';

export interface ReferenceLine {
    id: string;
    y: number;
    color: string;
    label?: string;
}

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
    tooltipDataSource: 'segment' | 'all';
    xAxisKey: string;
    yAxisKeys: string[];
    seriesColors: Record<string, string>;
    referenceLines?: ReferenceLine[];
    // Radar Chart specific
    withPolarGrid?: boolean;
    withPolarAngleAxis?: boolean;
    withPolarRadiusAxis?: boolean;
    orientation?: 'vertical' | 'horizontal';
}

export const CHART_SUPPORTED_PROPS: Record<ChartType, (keyof ChartConfig)[]> = {
    area: ['type', 'curveType', 'strokeWidth', 'withGradient', 'withDots', 'referenceLines', 'orientation'],
    bar: ['type', 'referenceLines', 'orientation'],
    line: ['curveType', 'strokeWidth', 'withDots', 'referenceLines', 'orientation'],
    scatter: ['referenceLines'],
    pie: ['withLabels', 'labelsType', 'strokeWidth', 'tooltipDataSource'],
    heatmap: [],
    radar: ['withPolarGrid', 'withPolarAngleAxis', 'withPolarRadiusAxis', 'withLegend'],
};

export interface TabProps {
    chartType: ChartType;
    setChartType: (type: ChartType) => void;
    config: ChartConfig;
    setConfig: (updater: (prev: ChartConfig) => ChartConfig) => void;
}

export const PRESET_COLORS = [
    '#228be6', '#15aabf', '#0ca678', '#40c057', '#82c91e',
    '#fab005', '#fd7e14', '#fa5252', '#e64980', '#be4bdb',
    '#7950f2', '#4c6ef5', '#74c0fc', '#63e6be', '#ffd43b',
    '#ffa94d', '#ff8787', '#f783ac', '#da77f2', '#748ffc',
];
