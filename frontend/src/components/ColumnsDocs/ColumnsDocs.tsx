import { useState } from 'react';
import { Box, Group, Stack, Text, UnstyledButton, ThemeIcon, Badge, Code, Table, ScrollArea, Divider, Grid } from '@mantine/core';
import { Fingerprint, Activity, Hash, Database, Bot, Clock, ChevronRight, X, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomRichTextEditor } from '../RichTextEditor/CustomRichTextEditor';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';

export interface ColumnDescription {
    timestamp: string;
    description: string;
    notes: string;
    isAiGenerated: boolean;
    author: string;
}

export interface ColumnData {
    name: string;
    dataType: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    defaultValue?: string;
    sampleValues: string[];
    descriptions: ColumnDescription[];
}

interface ColumnsDocsProps {
    columns: ColumnData[];
    isEditing?: boolean;
}

export const ColumnsDocs = ({ columns, isEditing }: ColumnsDocsProps) => {
    const setSelected = useDocsPanelStore(state => state.setSelected);
    const selectedItemId = useDocsPanelStore(state => state.selectedItemId);

    return (
        <Stack pt="sm" gap="xs">
            <Text fw={600} fz="md">Columns ({columns.length})</Text>

            <Table verticalSpacing="sm" highlightOnHover withRowBorders={false} style={{ cursor: 'pointer' }} withTableBorder>
                <Table.Thead bg="dark.9">
                    <Table.Tr>
                        <Table.Th fz="9px" fw={800} c="dark.3" tt="uppercase" style={{ width: 40, textAlign: 'center' }}>Keys</Table.Th>
                        <Table.Th fz="9px" fw={800} c="dark.3" tt="uppercase">Column</Table.Th>
                        <Table.Th fz="9px" fw={800} c="dark.3" tt="uppercase">Type</Table.Th>
                        <Table.Th fz="9px" fw={800} c="dark.3" tt="uppercase" style={{ textAlign: 'center' }}>Null</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {columns.map((column) => (
                        <Table.Tr
                            key={column.name}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelected(column.name, 'column');
                            }}
                            style={{
                                backgroundColor: selectedItemId === column.name ? 'rgba(33, 139, 255, 0.1)' : 'transparent',
                                borderLeft: selectedItemId === column.name ? '3px solid var(--mantine-color-blue-6)' : '3px solid var(--mantine-color-border)',
                                transition: 'background-color 0.2s ease, border-color 0.2s ease'
                            }}
                        >
                            <Table.Td>
                                <Group gap={4} justify="center">
                                    {column.isPrimaryKey && <Fingerprint size={12} color="var(--mantine-color-yellow-6)" />}
                                    {column.isForeignKey && <Activity size={12} color="var(--mantine-color-blue-6)" />}
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="13px" fw={700} style={{
                                    color: column.isPrimaryKey ? 'var(--mantine-color-yellow-4)' : 'var(--mantine-color-blue-4)',
                                    fontFamily: '"JetBrains Mono", monospace'
                                }}>
                                    {column.name}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fz="11px" fw={500} c="teal.5" ff="monospace">
                                    {column.dataType.toUpperCase()}
                                </Text>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'center' }}>
                                {column.isNullable ? (
                                    <CheckCircle2 size={10} color="var(--mantine-color-gray-6)" />
                                ) : (
                                    <AlertCircle size={10} color="var(--mantine-color-red-6)" />
                                )}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Stack>
    );
};

