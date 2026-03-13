import { AreaChart, BarChart, LineChart, ScatterChart, PieChart, RadarChart } from '@mantine/charts';
import { ChartArea, ChartBar, ChartLine, ChartPie, ChartScatter, Grid3x3, Hexagon } from 'lucide-react';
import { MatrixHeatmap } from './MatrixHeatmap';

export const CHART_COMPONENTS = {
    area: AreaChart as any,
    bar: BarChart as any,
    line: LineChart as any,
    scatter: ScatterChart as any,
    pie: PieChart as any,
    heatmap: MatrixHeatmap as any,
    radar: RadarChart as any,
};

export const CHART_ICONS = {
    area: { Icon: ChartArea, color: 'var(--mantine-color-yellow-6)' },
    bar: { Icon: ChartBar, color: 'var(--mantine-color-orange-6)' },
    line: { Icon: ChartLine, color: 'var(--mantine-color-red-6)' },
    scatter: { Icon: ChartScatter, color: 'var(--mantine-color-grape-6)' },
    pie: { Icon: ChartPie, color: 'var(--mantine-color-teal-6)' },
    heatmap: { Icon: Grid3x3, color: 'var(--mantine-color-green-6)' },
    radar: { Icon: Hexagon, color: 'var(--mantine-color-indigo-6)' },
};

export const DEFAULT_COLORS = [
    '#228be6',
    '#fa5252',
    '#40c057',
    '#be4bdb',
    '#82c91e',
    '#fab005',
    '#15aabf',
    '#fd7e14',
    '#e64980',
    '#0ca678',
];
