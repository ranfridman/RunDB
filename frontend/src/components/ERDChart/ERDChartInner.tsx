import { useMemo, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    type Node,
    type NodeTypes,
    BackgroundVariant,
    useReactFlow,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';
import { ERDTableNode, HEADER_HEIGHT, COL_ROW_HEIGHT } from '../ERDTableNode/ERDTableNode';
import { buildGraph } from './graphBuilder';
import { type TableNodeData } from './types';

import '@xyflow/react/dist/style.css';
import './ERDChart.css';

const nodeTypes: NodeTypes = {
    tableNode: ERDTableNode,
} as unknown as NodeTypes;

const NODE_V_GAP = 15;

export const ERDChartInner = () => {
    const { fitView } = useReactFlow();
    const setSelected = useDocsPanelStore(s => s.setSelected);
    const selectedItemId = useDocsPanelStore(s => s.selectedItemId);
    const dbData = useDocsPanelStore(s => s.dbData);
    if (!dbData) return null;

    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildGraph(dbData), [dbData]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const focusNode = useCallback((node: Node) => {
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
    }, [initialEdges, initialNodes, setNodes, setEdges, fitView]);

    useEffect(() => {
        if (selectedItemId) {
            const node = initialNodes.find(n => n.id === selectedItemId);
            if (node) {
                focusNode(node);
            }
        }
    }, [selectedItemId, initialNodes, focusNode]);

    const onInit = useCallback(() => {
        if (!selectedItemId) {
            setTimeout(() => fitView({ padding: 0.15 }), 100);
        }
    }, [fitView, selectedItemId]);

    const onNodeClick = useCallback(
        (event: any, node: Node) => {
            // Open documentation (only if we didn't click a specific column)
            const isColumnClick = event.target?.closest('.erd-table-node__column');
            if (!isColumnClick) {
                setSelected(node.id, 'table');
            }
            // Always focus the parent table node to show only it and connected tables
            focusNode(node);
        },
        [setSelected, focusNode]
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
