import React from 'react';

export interface ParsedTableData {
    columns: string[];
    rows: Record<string, any>[];
}

/**
 * A robust utility to extract structured data from React table elements.
 * Handles nested structures, fragments, and standard HTML table tags.
 */
export class TableParser {
    /**
     * Parses the children of a ComplexTable component.
     */
    static parse(children: React.ReactNode): ParsedTableData {
        const columns: string[] = [];
        const rows: Record<string, any>[] = [];

        if (!children) return { columns, rows };

        // 1. Find all rows (tr)
        const allRows = this.findNodesInTree(children, ['tr']);

        allRows.forEach(row => {
            const rowElement = row as React.ReactElement<any>;
            const cells = this.findNodesInTree(rowElement.props.children, ['th', 'td']);

            // Check if this is a header row (mostly th) or data row
            const isHeader = cells.every(cell => this.isType(cell, 'th'));

            if (isHeader && cells.length > 0) {
                // Only take the first header row if we find multiple
                if (columns.length === 0) {
                    cells.forEach(cell => {
                        columns.push(this.getText(cell).trim());
                    });
                }
            } else if (cells.length > 0) {
                const rowData: Record<string, any> = {};
                cells.forEach((cell, index) => {
                    const cellElement = cell as React.ReactElement<any>;
                    // Use found columns or default index
                    const colName = columns[index] || `col_${index}`;
                    rowData[colName] = {
                        text: this.getText(cell).trim(),
                        node: cellElement.props.children
                    };
                });
                if (Object.keys(rowData).length > 0) {
                    rows.push(rowData);
                }
            }
        });

        // 2. If no columns were found but rows exist, try to infer from data
        if (columns.length === 0 && rows.length > 0) {
            const maxColCount = Math.max(...rows.map(r => Object.keys(r).length));
            for (let i = 0; i < maxColCount; i++) {
                columns.push(`Column ${i + 1}`);
            }
        }

        return { columns, rows };
    }

    /**
     * Deeply finds all nodes matching types in a React tree.
     */
    private static findNodesInTree(node: React.ReactNode, types: string[]): React.ReactElement[] {
        const found: React.ReactElement[] = [];

        const traverse = (n: React.ReactNode) => {
            React.Children.forEach(n, child => {
                if (React.isValidElement(child)) {
                    const element = child as React.ReactElement<any>;
                    if (this.isType(element, types)) {
                        found.push(element);
                    } else if (element.props && element.props.children) {
                        traverse(element.props.children);
                    }
                } else if (child && typeof child === 'object' && (child as any).props?.children) {
                    // Handle non-standard elements that might have children
                    traverse((child as any).props.children);
                }
            });
        };

        traverse(node);
        return found;
    }

    /**
     * Checks if a React element matches one of the specified types.
     */
    private static isType(el: React.ReactElement, types: string | string[]): boolean {
        const typeList = Array.isArray(types) ? types : [types];
        const elType = el.type;

        if (typeof elType === 'string') {
            const tag = elType.toLowerCase();
            return typeList.some(t => t.toLowerCase() === tag);
        }

        // Handle components by name/displayName
        const typeName = (elType as any).displayName || (elType as any).name || '';
        const nameNormalized = typeName.toLowerCase();
        return typeList.some(t => t.toLowerCase() === nameNormalized || nameNormalized.includes(t.toLowerCase()));
    }

    /**
     * Extracts plain text from a React node.
     */
    private static getText(node: React.ReactNode): string {
        if (node === null || node === undefined) return '';
        if (typeof node === 'string' || typeof node === 'number') return String(node);
        if (Array.isArray(node)) return node.map(n => this.getText(n)).join('');
        if (React.isValidElement(node)) {
            const element = node as React.ReactElement<any>;
            return this.getText(element.props.children);
        }
        return '';
    }
}
