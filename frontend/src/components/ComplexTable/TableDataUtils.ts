import React from 'react';

/**
 * Extracts text content from a React node, handling strings, numbers, and nested elements.
 */
function getTextContent(node: React.ReactNode): string {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (React.isValidElement(node) && (node as any).props.children) {
        return getTextContent((node as any).props.children);
    }
    return '';
}

/**
 * Parses React table children (thead, tbody, tr, td, th) into raw data.
 */
export function parseTableChildren(children: React.ReactNode): {
    data: Record<string, unknown>[];
    columns: string[];
} {
    const columns: string[] = [];
    const data: Record<string, unknown>[] = [];

    // Helper to flatten children and handle fragments
    const flattenChildren = (node: React.ReactNode): React.ReactElement[] => {
        const result: React.ReactElement[] = [];
        React.Children.forEach(node, (child) => {
            if (React.isValidElement(child)) {
                const element = child as any;
                if (element.type === React.Fragment) {
                    result.push(...flattenChildren(element.props.children));
                } else {
                    result.push(element);
                }
            }
        });
        return result;
    };

    const flatChildren = flattenChildren(children);

    flatChildren.forEach((childElement) => {
        const type = childElement.type;
        const typeName = typeof type === 'string' ? type : (type as any)?.displayName || (type as any)?.name || 'unknown';

        // Handle thead
        if (typeName === 'thead') {
            flattenChildren((childElement as any).props.children).forEach((tr) => {
                const trElement = tr as any;
                const trTypeName = typeof trElement.type === 'string' ? trElement.type : trElement.type?.displayName || trElement.type?.name || 'unknown';
                if (trTypeName === 'tr') {
                    flattenChildren(trElement.props.children).forEach((th) => {
                        columns.push(getTextContent((th as any).props.children));
                    });
                }
            });
        }

        // Handle tbody
        if (typeName === 'tbody') {
            flattenChildren((childElement as any).props.children).forEach((tr) => {
                const trElement = tr as any;
                const trTypeName = typeof trElement.type === 'string' ? trElement.type : trElement.type?.displayName || trElement.type?.name || 'unknown';
                if (trTypeName === 'tr') {
                    const row: Record<string, unknown> = {};
                    flattenChildren(trElement.props.children).forEach((td, index) => {
                        const colName = columns[index] || `col_${index}`;
                        row[colName] = getTextContent((td as any).props.children);
                    });
                    data.push(row);
                }
            });
        }

        // Handle direct tr (if thead/tbody labels are missing)
        if (typeName === 'tr') {
            const row: Record<string, unknown> = {};
            const cells = flattenChildren((childElement as any).props.children);
            const isHeader = cells.some((cell) => {
                const cellElement = cell as any;
                const cellTypeName = typeof cellElement.type === 'string' ? cellElement.type : cellElement.type?.displayName || cellElement.type?.name || 'unknown';
                return cellTypeName === 'th';
            });

            cells.forEach((cell, index) => {
                const text = getTextContent((cell as any).props.children);
                if (isHeader) {
                    columns.push(text);
                } else {
                    const colName = columns[index] || `col_${index}`;
                    row[colName] = text;
                }
            });
            if (!isHeader) {
                data.push(row);
            }
        }
    });

    return { data, columns };
}
