import { Box, ActionIcon } from '@mantine/core';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';
import React, { useContext } from 'react';
import { BoardCell } from './BoardCell';
import { DashboardRow, PanelRegistry, PanelActionsContext } from './types';
import classes from '../Dashboard.module.css';

interface BoardRowProps {
    row: DashboardRow;
    rowIndex: number;
    totalRows: number;
    panelRegistry: PanelRegistry;
    onRemovePanel: (rowIndex: number, panelIndex: number) => void;
    onToggleSlot: (rowIndex: number) => void;
    onColResizeStart: (e: React.PointerEvent, panelIndex: number) => void;
    onRowResizeStart: (e: React.PointerEvent) => void;
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
    const actions = useContext(PanelActionsContext);
    const isEditMode = actions?.isEditMode ?? false;

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
                        panelRegistry={panelRegistry}
                        onRemovePanel={onRemovePanel}
                        onColResizeStart={(e: React.PointerEvent, pi: number) => onColResizeStart(e, pi)}
                    />
                ))}

                {isEditMode && (
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
                )}
                {isEditMode && (
                    <div className={classes.rowPlus}>
                        {row.panels.length < 4 && (
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
                )}
            </Box>

            {isEditMode ?
                <div
                    className={classes.hDivider}
                    onPointerDown={(e) => {
                        onRowResizeStart(e);
                    }}
                />
                : <Box py="xs"></Box>}
        </Box>
    );
};
