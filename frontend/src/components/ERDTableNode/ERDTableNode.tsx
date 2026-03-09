import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';
import { type TableNodeData } from '../ERDChart/types';
import './ERDTableNode.css';

export const HEADER_HEIGHT = 36;   // px – height of the table name header
export const COL_ROW_HEIGHT = 22;  // px – height of each column row
export const COL_PAD_TOP = 4;      // px – top padding of the columns container

/** Compute the vertical center (in px from node top) of the Nth column row */
export const colY = (index: number) =>
    HEADER_HEIGHT + COL_PAD_TOP + index * COL_ROW_HEIGHT + COL_ROW_HEIGHT / 2;

export const ERDTableNode = memo(({ data }: { data: TableNodeData }) => {
    const setSelected = useDocsPanelStore(s => s.setSelected);

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
                        <div
                            key={col.name}
                            className={classes}
                            onClick={() => {
                                setSelected(col.name, 'column');
                            }}
                            style={{ cursor: 'pointer' }}
                        >
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

ERDTableNode.displayName = 'ERDTableNode';
