import { useMemo, useCallback, memo, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    type Node,
    type Edge,
    type NodeTypes,
    Handle,
    Position,
    BackgroundVariant,
    useReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './ERDChart.css';

import mockDbData from '../DocsPanel/mockDbData.json';

/* ─────────────── Types ─────────────── */

interface ColumnInfo {
    name: string;
    dataType: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
}

interface TableNodeData {
    label: string;
    schema: string;
    columns: ColumnInfo[];
    dependencyLevel: number;
    columnCount: number;
    [key: string]: unknown;
}

/* ─────────────── Custom Node ─────────────── */

const HEADER_HEIGHT = 36;   // px – height of the table name header
const COL_ROW_HEIGHT = 22;  // px – height of each column row
const COL_PAD_TOP = 4;      // px – top padding of the columns container

/** Compute the vertical center (in px from node top) of the Nth column row */
const colY = (index: number) =>
    HEADER_HEIGHT + COL_PAD_TOP + index * COL_ROW_HEIGHT + COL_ROW_HEIGHT / 2;

const TableNode = memo(({ data }: { data: TableNodeData }) => {
    return (
        <div className="erd-table-node">
            <div className="erd-table-node__header">
                <span className="erd-table-node__title">{data.label}</span>
                <span className="erd-table-node__level">L{data.dependencyLevel}</span>
                <span className="erd-table-node__badge">{data.columnCount} cols</span>
            </div>

            <div className="erd-table-node__columns">
                {data.columns.map((col, idx) => {
                    const classes = [
                        'erd-table-node__column',
                        col.isPrimaryKey && 'erd-table-node__column--pk',
                        col.isForeignKey && 'erd-table-node__column--fk',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <div key={col.name} className={classes}>
                            {/* Left handle — target (FK receives incoming edge) */}
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={`${col.name}-target`}
                                style={{
                                    background: col.isForeignKey
                                        ? 'light-dark(var(--mantine-color-blue-7), var(--mantine-color-blue-4))'
                                        : 'transparent',
                                    width: col.isForeignKey ? 6 : 4,
                                    height: col.isForeignKey ? 6 : 4,
                                    border: 'none',
                                }}
                            />

                            <span className="erd-table-node__col-icon">
                                {col.isPrimaryKey ? '🔑' : col.isForeignKey ? '🔗' : '·'}
                            </span>
                            <span className="erd-table-node__col-name">{col.name}</span>
                            <span className="erd-table-node__col-type">{col.dataType}</span>

                            {/* Right handle — source (PK sends outgoing edge) */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`${col.name}-source`}
                                style={{
                                    background: col.isPrimaryKey
                                        ? 'light-dark(var(--mantine-color-orange-8), var(--mantine-color-yellow-4))'
                                        : 'transparent',
                                    width: col.isPrimaryKey ? 6 : 4,
                                    height: col.isPrimaryKey ? 6 : 4,
                                    border: 'none',
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

TableNode.displayName = 'TableNode';

const nodeTypes: NodeTypes = {
    tableNode: TableNode,
} as unknown as NodeTypes;

/* ─────────────── Layout helpers ─────────────── */

const NODE_WIDTH = 250;
const NODE_V_GAP = 15;      // Reduced from 30
const LEVEL_H_GAP = 280;    // Reduced from 340
const START_X = 60;
const START_Y = 60;

/* ─────────────── Build graph data ─────────────── */

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Group tables by dependency level for layout
    const levelBuckets = new Map<number, { schema: string; table: any }[]>();

    for (const schema of mockDbData.schemas) {
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

    // 2. Place nodes with vertical centering
    sortedLevels.forEach((level, levelIndex) => {
        const bucket = levelBuckets.get(level)!;
        const x = START_X + levelIndex * LEVEL_H_GAP;

        // Centering offset: start lower if this level is shorter than the max level
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
                },
            });

            // Build edges from dependsOn
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

/* ─────────────── Main component ─────────────── */

const ERDChartInner = () => {
    const { fitView } = useReactFlow();

    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildGraph(), []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onInit = useCallback(() => {
        setTimeout(() => fitView({ padding: 0.15 }), 100);
    }, [fitView]);

    const onNodeClick = useCallback(
        (_: any, node: Node) => {
            const sources = initialEdges.filter((e) => e.target === node.id).map((e) => e.source);
            const targets = initialEdges.filter((e) => e.source === node.id).map((e) => e.target);
            const neighborIds = new Set([...sources, ...targets, node.id]);

            const NODE_FOCUS_X_GAP = 300;
            const CENTER_X = 400;
            const CENTER_Y = 300;

            const getH = (id: string) => {
                const targetN = initialNodes.find(inNode => inNode.id === id);
                return targetN ? (HEADER_HEIGHT + 8 + (targetN.data as TableNodeData).columnCount * COL_ROW_HEIGHT) : 0;
            };

            const calcStack = (ids: string[]) => {
                const uniqueIds = Array.from(new Set(ids));
                const totalH = uniqueIds.reduce((acc, id, i) => acc + getH(id) + (i > 0 ? NODE_V_GAP : 0), 0);
                let currY = CENTER_Y - totalH / 2;
                const positions = new Map<string, number>();
                uniqueIds.forEach(id => {
                    positions.set(id, currY);
                    currY += getH(id) + NODE_V_GAP;
                });
                return positions;
            };

            const sourcePositions = calcStack(sources);
            const targetPositions = calcStack(targets);

            setNodes((nds) =>
                nds.map((n) => {
                    if (!neighborIds.has(n.id)) {
                        return { ...n, hidden: true };
                    }

                    let newPos = { ...n.position };
                    if (n.id === node.id) {
                        newPos = { x: CENTER_X, y: CENTER_Y - getH(n.id) / 2 };
                    } else if (sourcePositions.has(n.id)) {
                        newPos = { x: CENTER_X - NODE_FOCUS_X_GAP, y: sourcePositions.get(n.id)! };
                    } else if (targetPositions.has(n.id)) {
                        newPos = { x: CENTER_X + NODE_FOCUS_X_GAP, y: targetPositions.get(n.id)! };
                    }

                    return { ...n, hidden: false, position: newPos };
                })
            );

            setEdges((eds) =>
                eds.map((e) => ({
                    ...e,
                    hidden: !(e.source === node.id || e.target === node.id),
                }))
            );

            setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
        },
        [setNodes, setEdges, initialEdges, fitView]
    );

    const onPaneClick = useCallback(() => {
        // Reset focus: restore original positions and show all
        setNodes((nds) =>
            nds.map((n) => {
                const original = initialNodes.find((init) => init.id === n.id);
                return {
                    ...n,
                    hidden: false,
                    position: original ? { ...original.position } : n.position,
                };
            })
        );
        setEdges((eds) => eds.map((e) => ({ ...e, hidden: false })));
        setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 50);
    }, [setNodes, setEdges, initialNodes, fitView]);

    return (
        <div className="erd-chart-wrapper">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                onInit={onInit}
                fitView
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{ type: 'smoothstep' }}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1.5}
                    color="light-dark(var(--mantine-color-gray-8), var(--mantine-color-gray-7))"
                />
                <Controls showInteractive={true} />
                <MiniMap
                    nodeStrokeWidth={3}
                    nodeColor={() => 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))'}
                    maskColor="light-dark(rgba(255, 255, 255, 0.7), rgba(0, 0, 0, 0.6))"
                    pannable
                    zoomable
                />
            </ReactFlow>
        </div>
    );
};


export const ERDChart = () => (
    <ReactFlowProvider>
        <ERDChartInner />
    </ReactFlowProvider>
);
