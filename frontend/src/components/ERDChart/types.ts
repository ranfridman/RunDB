export interface ColumnInfo {
    name: string;
    dataType: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
}

export interface TableNodeData {
    label: string;
    schema: string;
    columns: ColumnInfo[];
    dependencyLevel: number;
    columnCount: number;
    [key: string]: unknown;
}
