import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Box, Group, Text } from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { BoardRow } from './BoardRow';
import { PanelRegistry, DashboardRow, BoardProps } from './types';
import classes from '../Dashboard.module.css';



export const Board = ({ rows, onRowsChange, onRemovePanel, onToggleSlot, panelRegistry, height, isEditMode }: BoardProps) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragInfo = useRef<{ type: 'h' | 'v', rowIndex: number, panelIndex?: number } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isEditMode || !dragInfo.current || !containerRef.current) return;
        const { type, rowIndex } = dragInfo.current;
        const rect = containerRef.current.getBoundingClientRect();

        if (type === 'h') {
            const move = e.movementY / 400;
            onRowsChange(prev => prev.map((r, i) => 
                i === rowIndex ? { ...r, height: Math.max(0.2, (r.height || 1) + move) } : r
            ));
        } else {
            const pi = dragInfo.current.panelIndex ?? 0;
            onRowsChange(prev => {
                const next = [...prev];
                const r = next[rowIndex];
                if (!r) return prev;
                
                const updatedRow = { ...r, panels: [...r.panels] };
                const p1 = { ...updatedRow.panels[pi] };
                const p2 = { ...updatedRow.panels[pi + 1] };

                if (p1 && p2) {
                    const totalFlex = updatedRow.panels.reduce((sum, p) => sum + (p.flex || 1), 0);
                    const moveFlex = (e.movementX / rect.width) * totalFlex;

                    const f1 = p1.flex || 1;
                    const f2 = p2.flex || 1;

                    const clampedMove = Math.min(Math.max(moveFlex, -f1 + 0.1), f2 - 0.1);
                    p1.flex = f1 + clampedMove;
                    p2.flex = f2 - clampedMove;
                    
                    updatedRow.panels[pi] = p1;
                    updatedRow.panels[pi + 1] = p2;
                    next[rowIndex] = updatedRow;
                    return next;
                }
                return prev;
            });
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (dragInfo.current) {
            containerRef.current?.releasePointerCapture(e.pointerId);
            dragInfo.current = null;
            setIsResizing(false);
            document.body.style.cursor = '';
        }
    };

    const handleResizeStart = (e: React.PointerEvent, type: 'h' | 'v', rowIndex: number, panelIndex?: number) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.stopPropagation();
        dragInfo.current = { type, rowIndex, panelIndex };
        setIsResizing(true);
        document.body.style.cursor = type === 'h' ? 'row-resize' : 'col-resize';
        containerRef.current?.setPointerCapture(e.pointerId);
    };

    const handleDragStart = (event: any) => {
        if (!isEditMode) return;
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (!isEditMode) return;
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

    const handleMoveRowUp = (rowIndex: number) => {
        if (!isEditMode) return;
        if (rowIndex <= 0) return;
        const newRows = [...rows];
        const temp = newRows[rowIndex - 1];
        newRows[rowIndex - 1] = newRows[rowIndex];
        newRows[rowIndex] = temp;
        onRowsChange(newRows);
    };

    const handleMoveRowDown = (rowIndex: number) => {
        if (!isEditMode) return;
        if (rowIndex >= rows.length - 1) return;
        const newRows = [...rows];
        const temp = newRows[rowIndex + 1];
        newRows[rowIndex + 1] = newRows[rowIndex];
        newRows[rowIndex] = temp;
        onRowsChange(newRows);
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
                className={`${classes.grid} ${isResizing ? classes.isResizing : ''}`}
                ref={containerRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                h={height}
                pt={0}
                pb={isEditMode ? 100 : 0}
            >
                <Box flex={1} display="flex" style={{ flexDirection: 'column', overflow: 'hidden' }} px="sm" pt="xs">
                    {rows.map((row, ri) => (
                        <BoardRow
                            key={row.id}
                            row={row}
                            rowIndex={ri}
                            totalRows={rows.length}
                            panelRegistry={panelRegistry}
                            onRemovePanel={onRemovePanel}
                            onToggleSlot={onToggleSlot}
                            onColResizeStart={(e, pi) => handleResizeStart(e, 'v', ri, pi)}
                            onRowResizeStart={(e) => handleResizeStart(e, 'h', ri)}
                            onMoveRowUp={() => handleMoveRowUp(ri)}
                            onMoveRowDown={() => handleMoveRowDown(ri)}
                        />
                    ))}
                </Box>

                <DragOverlay>
                    {isEditMode && activeId && activeData ? (
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
