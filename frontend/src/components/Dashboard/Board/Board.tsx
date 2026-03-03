import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Box, Group, ActionIcon, Text } from '@mantine/core';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { DraggablePanel } from './DraggablePanel';
import { DroppableCell } from './DroppableCell';
import classes from '../Dashboard.module.css';

// Types (mirrored from Dashboard.tsx for now, ideally shared)
type PanelType = 'schema' | 'performance' | 'logs' | 'environment' | 'new';
export interface Panel { id: string; type: PanelType; }
export interface DashboardRow { id: string; height: number; colSplit: number; panels: Panel[]; }

interface BoardProps {
    rows: DashboardRow[];
    onRowsChange: (rows: DashboardRow[]) => void;
    onRemovePanel: (rowIndex: number, panelIndex: number) => void;
    onToggleSlot: (rowIndex: number) => void;
    panelRegistry: Record<PanelType, { label: string; icon: any; content: any }>;
    height?: string | number;
}

export const Board = ({ rows, onRowsChange, onRemovePanel, onToggleSlot, panelRegistry, height }: BoardProps) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragInfo = useRef<{ type: 'h' | 'v', rowIndex: number } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts to prevent accidental drags vs clicks
            },
        })
    );

    // --- Resizing Logic (Moved from Dashboard.tsx) ---
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragInfo.current || !containerRef.current) return;
        const { type, rowIndex } = dragInfo.current;
        const rect = containerRef.current.getBoundingClientRect();

        // Clone rows deeply enough for resizing
        const next = rows.map(r => ({ ...r }));

        if (type === 'h') {
            const delta = (e.movementY / rect.height) * rows.length; // Normalized delta ?? 
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
            // Horizontal Split (Col Resize)
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

    // --- DnD Logic ---
    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;
        if (active.id !== over.id) {
            // Find source and destination
            let sourceRowIndex = -1, sourcePanelIndex = -1;
            let destRowIndex = -1, destPanelIndex = -1;

            rows.forEach((row, ri) => {
                row.panels.forEach((p, pi) => {
                    if (p.id === active.id) { sourceRowIndex = ri; sourcePanelIndex = pi; }
                    // Droppable ID matches Panel ID in this simple mapping
                    if (p.id === over.id) { destRowIndex = ri; destPanelIndex = pi; }
                });
            });

            if (sourceRowIndex !== -1 && destRowIndex !== -1) {
                const newRows = [...rows];
                // Deep clone row panels involved
                newRows[sourceRowIndex] = { ...newRows[sourceRowIndex], panels: [...newRows[sourceRowIndex].panels] };
                newRows[destRowIndex] = { ...newRows[destRowIndex], panels: [...newRows[destRowIndex].panels] };

                // Swagger Logic (Swap types/ids)
                const temp = newRows[sourceRowIndex].panels[sourcePanelIndex];
                newRows[sourceRowIndex].panels[sourcePanelIndex] = newRows[destRowIndex].panels[destPanelIndex];
                newRows[destRowIndex].panels[destPanelIndex] = temp;

                onRowsChange(newRows);
            }
        }
    };

    // Helper to find the active panel data for overlay
    const getActivePanelData = () => {
        for (const row of rows) {
            const p = row.panels.find(p => p.id === activeId);
            if (p) return panelRegistry[p.type];
        }
        return null;
    };
    const activeData = getActivePanelData();

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
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
                        <Box key={row.id} flex={row.height} display="flex" style={{ flexDirection: 'column', minHeight: 0 }}>
                            <Box className={classes.row} flex={1} style={{ minHeight: 0 }}>
                                {row.panels.map((p, pi) => {
                                    const d = panelRegistry[p.type];
                                    return (
                                        <Box key={p.id} flex={row.panels.length > 1 && pi === 0 ? `0 0 ${row.colSplit}%` : 1} display="flex" style={{ minWidth: 0 }}>
                                            <DroppableCell id={p.id} className={classes.cell}>
                                                <DraggablePanel id={p.id}>
                                                    <div className={classes.panelHeader}>
                                                        <Group gap={6}><Box c="yellow.6">{d.icon}</Box><Text className={classes.panelLabel}>{d.label}</Text></Group>
                                                        {/* Stop propagation on delete so it doesn't trigger drag? Handled by activationConstraint mostly. */}
                                                        <ActionIcon
                                                            variant="subtle"
                                                            size="xs"
                                                            color="gray"
                                                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                                                            onClick={() => onRemovePanel(ri, pi)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </ActionIcon>
                                                    </div>
                                                    <div className={classes.cellContent}>{d.content}</div>
                                                </DraggablePanel>
                                                {/* Add Edge overlay - not part of draggable? */}
                                                {row.panels.length === 1 && (
                                                    <div className={classes.addEdge} onClick={() => onToggleSlot(ri)}>
                                                        <Plus size={14} />
                                                    </div>
                                                )}
                                            </DroppableCell>

                                            {/* Resize Handles */}
                                            {pi === 0 && row.panels.length === 2 && (
                                                <div
                                                    className={classes.vDivider}
                                                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); dragInfo.current = { type: 'v', rowIndex: ri }; }}
                                                />
                                            )}
                                        </Box>
                                    )
                                })}
                            </Box>
                            {/* Row Divider */}
                            {ri < rows.length - 1 && (
                                <div
                                    className={classes.hDivider}
                                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); dragInfo.current = { type: 'h', rowIndex: ri }; }}
                                />
                            )}
                        </Box>
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
                            <div className={classes.cellContent}>{activeData.content}</div>
                        </Box>
                    ) : null}
                </DragOverlay>
            </Box>
        </DndContext>
    );
};
