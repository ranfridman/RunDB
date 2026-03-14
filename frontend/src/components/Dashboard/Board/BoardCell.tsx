import { useState, useContext } from 'react';
import { Box, Group, ActionIcon, Text, TextInput } from '@mantine/core';
import { Trash2, Pencil, Check } from 'lucide-react';
import { DraggablePanel } from './DraggablePanel';
import { DroppableCell } from './DroppableCell';
import { Panel, PanelRegistry, PanelActionsContext } from './types';
import { EditableTitle } from '../EditableTitle';
import classes from '../Dashboard.module.css';

interface BoardCellProps {
    panel: Panel;
    rowIndex: number;
    panelIndex: number;
    rowPanelsCount: number;
    panelRegistry: PanelRegistry;
    onRemovePanel: (rowIndex: number, panelIndex: number) => void;
    onColResizeStart?: (panelIndex: number) => void;
}

export const BoardCell = ({
    panel,
    rowIndex,
    panelIndex,
    rowPanelsCount,
    panelRegistry,
    onRemovePanel,
    onColResizeStart
}: BoardCellProps) => {
    const d = panelRegistry[panel.type];
    const isFirstPanel = panelIndex === 0;
    const actions = useContext(PanelActionsContext);
    const isEditMode = actions?.isEditMode ?? false;
    const [headerRef, setHeaderRef] = useState<HTMLDivElement | null>(null);

    return (
        <Box
            flex={panel.flex || 1}
            display="flex"
            pos="relative"
            style={{ minWidth: 0 }}
        >
            <DroppableCell id={panel.id} className={classes.cell} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <DraggablePanel id={panel.id}>
                    <div className={classes.panelHeader}>
                        <Group gap={6} align="center" pb="sm">
                            <Box c="yellow.6" style={{ display: 'flex', alignItems: 'center' }}>{d.icon}</Box>
                            <EditableTitle
                                value={panel.name || d.label}
                                onSave={(newName) => actions?.updatePanel(panel.id, { name: newName })}
                                placeholder={d.label}
                                className={classes.panelLabel}
                                disabled={!isEditMode}
                            />
                        </Group>
                        <Group gap={4}>
                            <div ref={setHeaderRef} style={{ display: 'flex', alignItems: 'center' }} />
                            {isEditMode && (
                                <ActionIcon
                                    variant="subtle"
                                    size="xs"
                                    color="gray"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={() => onRemovePanel(rowIndex, panelIndex)}
                                >
                                    <Trash2 size={12} />
                                </ActionIcon>
                            )}
                        </Group>
                    </div>
                    <div className={classes.cellContent}>
                        <d.component panel={panel} headerRef={headerRef} />
                    </div>
                </DraggablePanel>
            </DroppableCell>

            {isEditMode && panelIndex < rowPanelsCount - 1 && (
                <div
                    className={classes.vDivider}
                    onMouseDown={(e) => {
                        if (onColResizeStart) {
                            e.preventDefault();
                            e.stopPropagation();
                            onColResizeStart(panelIndex);
                        }
                    }}
                />
            )}
        </Box>
    );
};
