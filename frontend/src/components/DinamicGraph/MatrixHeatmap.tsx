import { Box, Tooltip, Text, ScrollArea } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useMemo, memo } from 'react';

interface MatrixHeatmapProps {
    data: any[];
    xAxisKey: string;
    yAxisKeys: string[];
    withTooltip?: boolean;
    h?: string | number;
    w?: string | number;
}

const HeatmapCell = memo(({
    val,
    min,
    max,
    label,
    xLabel,
    width,
    height,
    withTooltip,
    radius
}: {
    val: number,
    min: number,
    max: number,
    label: string,
    xLabel: any,
    width: number,
    height: number,
    withTooltip: boolean,
    radius: string
}) => {
    const ratio = (val - min) / (max - min);
    const backgroundColor = `rgba(34, 139, 230, ${0.1 + ratio * 0.9})`;

    const cell = (
        <Box
            w={width}
            h={height}
            style={{
                backgroundColor,
                borderRadius: radius,
                transition: 'transform 0.1s',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                if (width >= 12 && height >= 12) {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }
            }}
            onMouseLeave={(e) => {
                if (width >= 12 && height >= 12) {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }
            }}
        />
    );

    if (!withTooltip) return cell;

    return (
        <Tooltip
            label={val}
            withArrow
            position="top"
            openDelay={50}
        >
            {cell}
        </Tooltip>
    );
});

HeatmapCell.displayName = 'HeatmapCell';

export const MatrixHeatmap = memo(({ data = [], xAxisKey, yAxisKeys = [], withTooltip = true, h = '100%', w = '100%' }: MatrixHeatmapProps) => {
    const { ref, width, height } = useElementSize<HTMLDivElement>();

    // Safety guards
    if (!xAxisKey || !yAxisKeys.length || !data.length) {
        return (
            <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="xs" c="dimmed">Insufficient data configuration</Text>
            </Box>
        );
    }

    try {
        const { min, max, rows } = useMemo(() => {
            let minVal = Infinity;
            let maxVal = -Infinity;

            const processedRows = yAxisKeys.map(key => {
                const values = data.map(d => {
                    const val = typeof d[key] === 'number' ? d[key] : parseFloat(String(d[key])) || 0;
                    if (val < minVal) minVal = val;
                    if (val > maxVal) maxVal = val;
                    return val;
                });
                return { label: key, values };
            });

            if (minVal === Infinity) minVal = 0;
            if (maxVal === -Infinity) maxVal = 100;
            if (minVal === maxVal) { minVal -= 1; maxVal += 1; }

            return { min: minVal, max: maxVal, rows: processedRows };
        }, [data, yAxisKeys]);

        const dim = useMemo(() => {
            const numCols = data.length || 1;
            const numRows = rows.length || 1;
            const initialLabelWidth = (width > 0 && width < 300) ? 60 : 100;

            const effectiveWidth = width || 500;
            const effectiveHeight = height || 400;

            const availableWidth = Math.max(0, effectiveWidth - initialLabelWidth - 24);
            const availableHeight = Math.max(0, effectiveHeight - 64);

            const calculatedGap = numCols > 40 ? 1 : numCols > 20 ? 2 : 4;

            let wSize = (availableWidth - (numCols * calculatedGap)) / numCols;
            wSize = Math.max(8, isNaN(wSize) ? 20 : wSize);

            let hSize = (availableHeight - (numRows * calculatedGap)) / numRows;
            hSize = Math.max(10, Math.min(hSize, 40));

            return {
                cellWidth: wSize,
                cellHeight: hSize,
                gap: calculatedGap,
                labelWidth: initialLabelWidth,
                radius: wSize < 10 ? '0px' : wSize < 20 ? '1px' : '3px'
            };
        }, [data.length, rows.length, width, height]);

        const xLabels = useMemo(() => data.map(d => String(d[xAxisKey] || '')), [data, xAxisKey]);
        const totalContentWidth = dim.labelWidth + (data.length * (dim.cellWidth + dim.gap)) + 20;

        return (
            <Box ref={ref} style={{ height: h, width: w, overflow: 'hidden', position: 'relative' }}>
                <ScrollArea h="100%" w="100%">
                    <Box p="xs" style={{ minWidth: totalContentWidth }}>
                        <Box style={{
                            display: 'grid',
                            gridTemplateColumns: `${Math.floor(dim.labelWidth)}px repeat(${data.length}, ${Math.floor(dim.cellWidth)}px)`,
                            gap: dim.gap,
                            alignItems: 'end'
                        }}>
                            <Box />
                            {xLabels.map((label, i) => (
                                <Box key={i} style={{ textAlign: 'center' }}>
                                    <Text size={dim.cellWidth < 12 ? "7px" : "10px"} c="dimmed" style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                        whiteSpace: 'nowrap',
                                        display: dim.cellWidth < 8 ? 'none' : 'block'
                                    }}>
                                        {label}
                                    </Text>
                                </Box>
                            ))}

                            {rows.map((row, rowIndex) => (
                                <Box key={rowIndex} style={{ display: 'contents' }}>
                                    <Box style={{
                                        textAlign: 'right',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        height: Math.floor(dim.cellHeight)
                                    }}>
                                        <Text size={dim.cellHeight < 15 ? "xs" : "sm"} fw={500} truncate>
                                            {row.label}
                                        </Text>
                                    </Box>
                                    {row.values.map((val, colIndex) => (
                                        <HeatmapCell
                                            key={colIndex}
                                            val={val}
                                            min={min}
                                            max={max}
                                            label={row.label}
                                            xLabel={xLabels[colIndex]}
                                            width={dim.cellWidth}
                                            height={dim.cellHeight}
                                            withTooltip={withTooltip}
                                            radius={dim.radius}
                                        />
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </ScrollArea>
            </Box>
        );
    } catch (e: any) {
        return (
            <Box p="md">
                <Text size="xs" color="red">Render Error: {e.message}</Text>
            </Box>
        );
    }
});

MatrixHeatmap.displayName = 'MatrixHeatmap';
