import { type Node, type Edge } from '@xyflow/react';
import { type DbData } from '../DocsPanel/DocsPanelStore';
import { type TableNodeData, type ColumnInfo } from './types';
import { HEADER_HEIGHT, COL_ROW_HEIGHT } from '../ERDTableNode/ERDTableNode';

const NODE_V_GAP = 15;      // Reduced from 30
const LEVEL_H_GAP = 280;    // Reduced from 340
const START_X = 60;
const START_Y = 60;

export function buildGraph(dbData: DbData): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Group tables by dependency level for layout
    const levelBuckets = new Map<number, { schema: string; table: any }[]>();

    for (const schema of dbData.schemas) {
        for (const table of schema.tables) {
            const level = (table as any).dependencyLevel ?? 0;
            if (!levelBuckets.has(level)) levelBuckets.set(level, []);
            levelBuckets.get(level)!.push({ schema: schema.name, table });
        }
    }

    // Sort levels
    const sortedLevels = [...levelBuckets.keys()].sort((a, b) => a - b);

    // 1. Pre-calculate total height for each level column to center them vertically
    const levelHeights = new Map<number, number>();
    sortedLevels.forEach((level) => {
        const bucket = levelBuckets.get(level)!;
        let totalH = 0;
        bucket.forEach((entry) => {
            const colCount = (entry.table.columns || []).length;
            const nodeH = HEADER_HEIGHT + 8 + colCount * COL_ROW_HEIGHT;
            totalH += nodeH + NODE_V_GAP;
        });
        levelHeights.set(level, totalH - NODE_V_GAP); // Remove last gap
    });

    // Find the max height to use as a centering baseline
    const maxHeight = Math.max(...Array.from(levelHeights.values()), 0);

    // 2. Place nodes
    sortedLevels.forEach((level, levelIndex) => {
        const bucket = levelBuckets.get(level)!;
        const x = START_X + levelIndex * LEVEL_H_GAP;

        const levelH = levelHeights.get(level) || 0;
        let currentY = START_Y + (maxHeight - levelH) / 2;

        bucket.forEach((entry) => {
            const t = entry.table;
            const columns: ColumnInfo[] = (t.columns || []).map((c: any) => ({
                name: c.name,
                dataType: c.dataType,
                isPrimaryKey: !!c.isPrimaryKey,
                isForeignKey: !!c.isForeignKey,
            }));

            const nodeHeight = HEADER_HEIGHT + 8 + columns.length * COL_ROW_HEIGHT;
            const y = currentY;

            currentY += nodeHeight + NODE_V_GAP;

            const nodeId = `${entry.schema}.${t.name}`;

            nodes.push({
                id: nodeId,
                type: 'tableNode',
                position: { x, y },
                data: {
                    label: t.name,
                    schema: entry.schema,
                    columns,
                    dependencyLevel: level,
                    columnCount: columns.length,
                } as TableNodeData,
            });

            // edges code remains same...
            if (t.dependsOn && Array.isArray(t.dependsOn)) {
                for (const dep of t.dependsOn) {
                    const sourceNodeId = `${dep.schema}.${dep.table}`;
                    const edgeId = `e-${sourceNodeId}-${nodeId}-${dep.column}`;
                    edges.push({
                        id: edgeId,
                        source: sourceNodeId,
                        sourceHandle: `${dep.referencedColumn}-source`,
                        target: nodeId,
                        targetHandle: `${dep.column}-target`,
                        animated: true,
                        label: `${dep.referencedColumn} → ${dep.column}`,
                        labelStyle: {
                            fontSize: 9,
                            fill: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-2))',
                            fontFamily: 'monospace'
                        },
                        labelBgStyle: {
                            fill: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))',
                            fillOpacity: 0.9
                        },
                        labelBgPadding: [4, 2] as [number, number],
                        labelBgBorderRadius: 3,
                        style: {
                            stroke: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))',
                            strokeWidth: 1.5
                        },
                        markerEnd: {
                            type: 'arrowclosed' as any,
                            color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))',
                            width: 16,
                            height: 16,
                        },
                    });
                }
            }
        });
    });

    return { nodes, edges };
}
