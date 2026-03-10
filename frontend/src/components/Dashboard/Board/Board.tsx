import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Box, Group, Text } from '@mantine/core';
import { useState, useRef } from 'react';
import { BoardRow } from './BoardRow';
import { PanelRegistry, DashboardRow } from './types';
import classes from '../Dashboard.module.css';

interface BoardProps {
    rows: DashboardRow[];
    onRowsChange: (rows: DashboardRow[]) => void;
    onRemovePanel: (rowIndex: number, panelIndex: number) => void;
    onToggleSlot: (rowIndex: number) => void;
    panelRegistry: PanelRegistry;
    height?: string | number;
}

export const Board = ({ rows, onRowsChange, onRemovePanel, onToggleSlot, panelRegistry, height }: BoardProps) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragInfo = useRef<{ type: 'h' | 'v', rowIndex: number } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragInfo.current || !containerRef.current) return;
        const { type, rowIndex } = dragInfo.current;
        const rect = containerRef.current.getBoundingClientRect();
        const next = rows.map(r => ({ ...r }));

        if (type === 'h') {
            const r1 = next[rowIndex];
            const r2 = next[rowIndex + 1];
            if (r1 && r2) {
                const move = (e.movementY / rect.height) * rows.length;
                const clampedMove = Math.min(Math.max(move, -r1.height + 0.2), r2.height - 0.2);
                r1.height += clampedMove;
                r2.height -= clampedMove;
                onRowsChange(next);
            }
        } else {
            const r = next[rowIndex];
            const movePercent = (e.movementX / rect.width) * 100;
            r.colSplit = Math.min(Math.max(r.colSplit + movePercent, 10), 90);
            onRowsChange(next);
        }
    };

    const handleMouseUp = () => {
        dragInfo.current = null;
        document.body.style.cursor = '';
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        if (active.id !== over.id) {
            let sourceRowIndex = -1, sourcePanelIndex = -1, destRowIndex = -1, destPanelIndex = -1;
            rows.forEach((row, ri) => {
                row.panels.forEach((p, pi) => {
                    if (p.id === active.id) { sourceRowIndex = ri; sourcePanelIndex = pi; }
                    if (p.id === over.id) { destRowIndex = ri; destPanelIndex = pi; }
                });
            });
            if (sourceRowIndex !== -1 && destRowIndex !== -1) {
                const newRows = [...rows];
                newRows[sourceRowIndex] = { ...newRows[sourceRowIndex], panels: [...newRows[sourceRowIndex].panels] };
                newRows[destRowIndex] = { ...newRows[destRowIndex], panels: [...newRows[destRowIndex].panels] };
                const temp = newRows[sourceRowIndex].panels[sourcePanelIndex];
                newRows[sourceRowIndex].panels[sourcePanelIndex] = newRows[destRowIndex].panels[destPanelIndex];
                newRows[destRowIndex].panels[destPanelIndex] = temp;
                onRowsChange(newRows);
            }
        }
    };

    const getActivePanelData = () => {
        for (const row of rows) {
            const p = row.panels.find(p => p.id === activeId);
            if (p) return { ...panelRegistry[p.type], label: p.name || panelRegistry[p.type].label, panel: p };
        }
        return null;
    };
    const activeData = getActivePanelData();

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box
                className={classes.grid}
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                h={height}
            >
                <Box flex={1} display="flex" style={{ flexDirection: 'column', overflow: 'hidden', paddingTop: '3px' }}>
                    {rows.map((row, ri) => (
                        <BoardRow
                            key={row.id}
                            row={row}
                            rowIndex={ri}
                            totalRows={rows.length}
                            panelRegistry={panelRegistry}
                            onRemovePanel={onRemovePanel}
                            onToggleSlot={onToggleSlot}
                            onColResizeStart={(index) => dragInfo.current = { type: 'v', rowIndex: index }}
                            onRowResizeStart={(index) => dragInfo.current = { type: 'h', rowIndex: index }}
                        />
                    ))}
                </Box>

                <DragOverlay>
                    {activeId && activeData ? (
                        <Box
                            className={classes.cell}
                            style={{
                                height: '100%',
                                background: 'var(--mantine-color-body)',
                                border: '1px solid var(--mantine-color-yellow-4)',
                                boxShadow: 'var(--mantine-shadow-xl)',
                                opacity: 0.9
                            }}
                        >
                            <div className={classes.panelHeader}>
                                <Group gap={6}><Box c="yellow.6">{activeData.icon}</Box><Text className={classes.panelLabel}>{activeData.label}</Text></Group>
                            </div>
                            <div className={classes.cellContent}>
                                <activeData.component panel={activeData.panel} />
                            </div>
                        </Box>
                    ) : null}
                </DragOverlay>
            </Box>
        </DndContext>
    );
};
