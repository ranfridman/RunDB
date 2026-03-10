import { Box } from '@mantine/core';
import { BoardCell } from './BoardCell';
import { DashboardRow, PanelRegistry } from './types';
import classes from '../Dashboard.module.css';

interface BoardRowProps {
    row: DashboardRow;
    rowIndex: number;
    totalRows: number;
    panelRegistry: PanelRegistry;
    onRemovePanel: (rowIndex: number, panelIndex: number) => void;
    onToggleSlot: (rowIndex: number) => void;
    onColResizeStart: (rowIndex: number) => void;
    onRowResizeStart: (rowIndex: number) => void;
}

export const BoardRow = ({
    row,
    rowIndex,
    totalRows,
    panelRegistry,
    onRemovePanel,
    onToggleSlot,
    onColResizeStart,
    onRowResizeStart
}: BoardRowProps) => {
    const isLastRow = rowIndex === totalRows - 1;

    return (
        <Box
            flex={row.height}
            display="flex"
            style={{ flexDirection: 'column', minHeight: 0 }}
        >
            <Box className={classes.row} flex={1} style={{ minHeight: 0 }}>
                {row.panels.map((p, pi) => (
                    <BoardCell
                        key={p.id}
                        panel={p}
                        rowIndex={rowIndex}
                        panelIndex={pi}
                        rowPanelsCount={row.panels.length}
                        colSplit={row.colSplit}
                        panelRegistry={panelRegistry}
                        onRemovePanel={onRemovePanel}
                        onToggleSlot={onToggleSlot}
                        onColResizeStart={() => onColResizeStart(rowIndex)}
                    />
                ))}
            </Box>

            {!isLastRow && (
                <div
                    className={classes.hDivider}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRowResizeStart(rowIndex);
                    }}
                />
            )}
        </Box>
    );
};
