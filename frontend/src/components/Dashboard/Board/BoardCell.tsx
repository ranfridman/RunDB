import { Box, Group, ActionIcon, Text } from '@mantine/core';
import { Plus, Trash2 } from 'lucide-react';
import { DraggablePanel } from './DraggablePanel';
import { DroppableCell } from './DroppableCell';
import { Panel, PanelRegistry } from './types';
import classes from '../Dashboard.module.css';

interface BoardCellProps {
    panel: Panel;
    rowIndex: number;
    panelIndex: number;
    rowPanelsCount: number;
    colSplit: number;
    panelRegistry: PanelRegistry;
    onRemovePanel: (rowIndex: number, panelIndex: number) => void;
    onToggleSlot: (rowIndex: number) => void;
    onColResizeStart?: () => void;
}

export const BoardCell = ({
    panel,
    rowIndex,
    panelIndex,
    rowPanelsCount,
    colSplit,
    panelRegistry,
    onRemovePanel,
    onToggleSlot,
    onColResizeStart
}: BoardCellProps) => {
    const d = panelRegistry[panel.type];
    const isFirstPanel = panelIndex === 0;

    return (
        <Box
            flex={rowPanelsCount > 1 && isFirstPanel ? `0 0 ${colSplit}%` : 1}
            display="flex"
            pos="relative"
            style={{ minWidth: 0 }}
        >
            <DroppableCell id={panel.id} className={classes.cell} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <DraggablePanel id={panel.id}>
                    <div className={classes.panelHeader}>
                        <Group gap={6}>
                            <Box c="yellow.6">{d.icon}</Box>
                            <Text className={classes.panelLabel}>{panel.name || d.label}</Text>
                        </Group>
                        <ActionIcon
                            variant="subtle"
                            size="xs"
                            color="gray"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => onRemovePanel(rowIndex, panelIndex)}
                        >
                            <Trash2 size={12} />
                        </ActionIcon>
                    </div>
                    <div className={classes.cellContent}>
                        <d.component panel={panel} />
                    </div>
                </DraggablePanel>
                {rowPanelsCount === 1 && (
                    <div className={classes.addEdge} onClick={() => onToggleSlot(rowIndex)}>
                        <Plus size={14} />
                    </div>
                )}
            </DroppableCell>

            {isFirstPanel && rowPanelsCount === 2 && (
                <div
                    className={classes.vDivider}
                    onMouseDown={(e) => {
                        if (onColResizeStart) {
                            e.preventDefault();
                            e.stopPropagation();
                            onColResizeStart();
                        }
                    }}
                />
            )}
        </Box>
    );
};
