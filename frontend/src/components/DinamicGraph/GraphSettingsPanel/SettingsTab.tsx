import { MessageSquareText, LayoutList, Layers, Activity, Grid2x2, MoveRight, MoveUp, Palette, CircleDot, Type, TrendingUp, GitCommit, Layout, Maximize, ChartSpline, ChartLine, ChartGantt, Percent, PaintBucket, Hexagon, Target } from 'lucide-react';
import { TabProps, CHART_SUPPORTED_PROPS } from './types';
import { MenuRow, ToggleRow, CompactSegmentRow } from './Primitives';

export const SettingsTab = ({ chartType, config, setConfig, openKey, setOpenKey }: TabProps & { openKey: string | null, setOpenKey: (key: string | null) => void }) => {
    const isPie = chartType === 'pie';
    const isHeatmap = chartType === 'heatmap';
    const isRadar = chartType === 'radar';
    const hideAxesSettings = isPie || isHeatmap || isRadar;
    const supportedProps = CHART_SUPPORTED_PROPS[chartType];

    return (
        <>
            <ToggleRow
                label="Show Tooltip"
                icon={MessageSquareText}
                checked={config.withTooltip}
                onChange={v => setConfig(p => ({ ...p, withTooltip: v }))}
            />

            {(!hideAxesSettings || supportedProps.includes('withLegend')) && (
                <ToggleRow
                    label="Show Legend"
                    icon={LayoutList}
                    checked={config.withLegend}
                    onChange={v => setConfig(p => ({ ...p, withLegend: v }))}
                />
            )}

            {supportedProps.includes('withPolarGrid') && (
                <ToggleRow
                    label="Polar Grid"
                    icon={Grid2x2}
                    checked={config.withPolarGrid || false}
                    onChange={v => setConfig(p => ({ ...p, withPolarGrid: v }))}
                />
            )}

            {supportedProps.includes('withPolarAngleAxis') && (
                <ToggleRow
                    label="Angle Axis"
                    icon={Type}
                    checked={config.withPolarAngleAxis || false}
                    onChange={v => setConfig(p => ({ ...p, withPolarAngleAxis: v }))}
                />
            )}

            {supportedProps.includes('withPolarRadiusAxis') && (
                <ToggleRow
                    label="Radius Axis"
                    icon={Target}
                    checked={config.withPolarRadiusAxis || false}
                    onChange={v => setConfig(p => ({ ...p, withPolarRadiusAxis: v }))}
                />
            )}

            {supportedProps.includes('type') && (
                <CompactSegmentRow
                    label="Sub type"
                    icon={Layers}
                    value={config.type || 'default'}
                    options={[
                        { value: 'default', icon: Layout, label: 'Default' },
                        { value: 'stacked', icon: Layers, label: 'Stacked' },
                        { value: 'percent', icon: Percent, label: 'Percent' }
                    ]}
                    onChange={(val: string) => setConfig(p => ({ ...p, type: val as any }))}
                />
            )}

            {supportedProps.includes('curveType') && (
                <CompactSegmentRow
                    label="Curve type"
                    icon={Activity}
                    value={config.curveType || 'linear'}
                    options={[
                        { value: 'linear', icon: ChartLine, label: 'Linear' },
                        { value: 'monotone', icon: ChartSpline, label: 'Monotone' },
                        { value: 'step', icon: ChartGantt, label: 'Step' }
                    ]}
                    onChange={(val: string) => setConfig(p => ({ ...p, curveType: val as any }))}
                />
            )}

            {
                !hideAxesSettings && (
                    <>
                        <MenuRow
                            label="Tick line"
                            icon={Grid2x2}
                            value={config.tickLine}
                            options={['x', 'y', 'xy', 'none']}
                            onSelect={(val: string) => setConfig(p => ({ ...p, tickLine: val as any }))}
                            opened={openKey === 'tick-line'}
                            onOpenChange={(o: boolean) => setOpenKey(o ? 'tick-line' : null)}
                        />
                        <ToggleRow
                            label="Show X axis"
                            icon={MoveRight}
                            checked={config.withXAxis}
                            onChange={v => setConfig(p => ({ ...p, withXAxis: v }))}
                        />
                        <ToggleRow
                            label="Show Y axis"
                            icon={MoveUp}
                            checked={config.withYAxis}
                            onChange={v => setConfig(p => ({ ...p, withYAxis: v }))}
                        />
                    </>
                )
            }

            {
                supportedProps.includes('withGradient') && (
                    <ToggleRow
                        label="Gradient"
                        icon={PaintBucket}
                        checked={config.withGradient}
                        onChange={v => setConfig(p => ({ ...p, withGradient: v }))}
                    />
                )
            }

            {
                supportedProps.includes('withDots') && (
                    <ToggleRow
                        label="Dots"
                        icon={CircleDot}
                        checked={config.withDots}
                        onChange={v => setConfig(p => ({ ...p, withDots: v }))}
                    />
                )
            }

            {
                supportedProps.includes('withLabels') && (
                    <ToggleRow
                        label="Labels"
                        icon={Type}
                        checked={config.withLabels}
                        onChange={v => setConfig(p => ({ ...p, withLabels: v }))}
                    />
                )
            }

            {
                isPie && config.withLabels && (
                    <ToggleRow
                        label="Percentage"
                        icon={Percent}
                        checked={config.labelsType === 'percent'}
                        onChange={v => setConfig(p => ({ ...p, labelsType: v ? 'percent' : 'value' }))}
                    />
                )
            }
        </>
    );
};
