import { Box, ActionIcon } from '@mantine/core';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';
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
    onMoveRowUp?: () => void;
    onMoveRowDown?: () => void;
}

export const BoardRow = ({
    row,
    rowIndex,
    totalRows,
    panelRegistry,
    onRemovePanel,
    onToggleSlot,
    onColResizeStart,
    onRowResizeStart,
    onMoveRowUp,
    onMoveRowDown
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
                        onColResizeStart={() => onColResizeStart(rowIndex)}
                    />
                ))}

                <div className={classes.rowArrows}>
                    {rowIndex > 0 && (
                        <ActionIcon
                            variant="default"
                            size="sm"
                            className={classes.rowControlBtn}
                            onClick={onMoveRowUp}
                        >
                            <ArrowUp size={14} />
                        </ActionIcon>
                    )}
                    {!isLastRow && (
                        <ActionIcon
                            variant="default"
                            size="sm"
                            className={classes.rowControlBtn}
                            onClick={onMoveRowDown}
                        >
                            <ArrowDown size={14} />
                        </ActionIcon>
                    )}
                </div>
                <div className={classes.rowPlus}>
                    {row.panels.length === 1 && (
                        <ActionIcon
                            variant="default"
                            size="sm"
                            className={classes.rowControlBtn}
                            onClick={() => onToggleSlot(rowIndex)}
                        >
                            <Plus size={14} />
                        </ActionIcon>
                    )}
                </div>
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
