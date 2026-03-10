import { TabProps, CHART_SUPPORTED_PROPS } from './types';
import { MenuRow, ToggleRow } from './Primitives';

export const SettingsTab = ({ chartType, config, setConfig, openKey, setOpenKey }: TabProps & { openKey: string | null, setOpenKey: (key: string | null) => void }) => {
    const isPie = chartType === 'pie';
    const isHeatmap = chartType === 'heatmap';
    const hideAxesSettings = isPie || isHeatmap;
    const supportedProps = CHART_SUPPORTED_PROPS[chartType];

    return (
        <>
            <ToggleRow label="Show Tooltip" checked={config.withTooltip}
                onChange={v => setConfig(p => ({ ...p, withTooltip: v }))} />

            {!hideAxesSettings && (
                <ToggleRow label="Show Legend" checked={config.withLegend}
                    onChange={v => setConfig(p => ({ ...p, withLegend: v }))} />
            )}

            {supportedProps.includes('type') && (
                <MenuRow
                    label="Sub type"
                    value={config.type}
                    options={['default', 'stacked', 'percent']}
                    onSelect={(val: string) => setConfig(p => ({ ...p, type: val as any }))}
                    opened={openKey === 'sub-type'}
                    onOpenChange={(o: boolean) => setOpenKey(o ? 'sub-type' : null)}
                />
            )}

            {supportedProps.includes('curveType') && (
                <MenuRow
                    label="Curve type"
                    value={config.curveType}
                    options={['linear', 'monotone', 'step']}
                    onSelect={(val: string) => setConfig(p => ({ ...p, curveType: val as any }))}
                    opened={openKey === 'curve-type'}
                    onOpenChange={(o: boolean) => setOpenKey(o ? 'curve-type' : null)}
                />
            )}

            {!hideAxesSettings && (
                <>
                    <MenuRow
                        label="Tick line"
                        value={config.tickLine}
                        options={['x', 'y', 'xy', 'none']}
                        onSelect={(val: string) => setConfig(p => ({ ...p, tickLine: val as any }))}
                        opened={openKey === 'tick-line'}
                        onOpenChange={(o: boolean) => setOpenKey(o ? 'tick-line' : null)}
                    />
                    <ToggleRow label="Show X axis" checked={config.withXAxis} onChange={v => setConfig(p => ({ ...p, withXAxis: v }))} />
                    <ToggleRow label="Show Y axis" checked={config.withYAxis} onChange={v => setConfig(p => ({ ...p, withYAxis: v }))} />
                </>
            )}

            {/* {supportedProps.includes('strokeWidth') && (
                <MenuRow
                    label="Stroke width"
                    value={String(config.strokeWidth)}
                    options={['0', '1', '2', '3', '4', '5']}
                    onSelect={(val: string) => setConfig(p => ({ ...p, strokeWidth: parseInt(val) }))}
                    opened={openKey === 'stroke-width'}
                    onOpenChange={(o: boolean) => setOpenKey(o ? 'stroke-width' : null)}
                />
            )} */}

            {supportedProps.includes('withGradient') && (
                <ToggleRow label="Gradient" checked={config.withGradient} onChange={v => setConfig(p => ({ ...p, withGradient: v }))} />
            )}

            {supportedProps.includes('withDots') && (
                <ToggleRow label="Dots" checked={config.withDots} onChange={v => setConfig(p => ({ ...p, withDots: v }))} />
            )}

            {supportedProps.includes('withLabels') && (
                <ToggleRow label="Labels" checked={config.withLabels} onChange={v => setConfig(p => ({ ...p, withLabels: v }))} />
            )}
        </>
    );
};
