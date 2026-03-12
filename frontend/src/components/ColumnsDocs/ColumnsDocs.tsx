import { useState, useEffect, useRef } from 'react';
import { Box, Group, Stack, Text, UnstyledButton, ThemeIcon, Badge, Card, Grid, Divider, Tooltip, Collapse } from '@mantine/core';
import { Fingerprint, Activity, Hash, ChevronRight, AlertCircle, CheckCircle2, Key, Link2, Columns, FileText, Dot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';
import { CustomRichTextEditor } from '../RichTextEditor/CustomRichTextEditor';

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
    schema: string;
    tableName: string;
    columns: ColumnData[];
    isEditing?: boolean;
}

const ColumnRow = ({ column, isSelected, onClick, isEditing }: {
    column: ColumnData;
    isSelected: boolean;
    onClick: () => void;
    isEditing: boolean;
}) => {
    const d = column.descriptions[column.descriptions.length - 1];
    const [shouldRenderEditor, setShouldRenderEditor] = useState(isSelected);
    const rowRef = useRef<HTMLDivElement>(null);

    // Scroll into view when selected
    useEffect(() => {
        if (isSelected && rowRef.current) {
            // Delay slightly to allow the Collapse animation to start/mount
            const timeout = setTimeout(() => {
                rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isSelected]);

    useEffect(() => {
        if (isSelected) {
            setShouldRenderEditor(true);
        } else {
            const timeout = setTimeout(() => setShouldRenderEditor(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isSelected]);

    return (
        <motion.div
            ref={rowRef}
            layout
            animate={{ x: isSelected ? 2 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <Box
                style={{
                    borderColor: isSelected ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-dark-4)',
                    borderLeft: isSelected ? '3px solid var(--mantine-color-blue-6)' : '3px solid transparent',
                    transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
            >

                <UnstyledButton
                    w="100%"
                    px="md"
                    py={8}
                    onClick={onClick}
                    style={{
                        backgroundColor: isSelected ? 'var(--mantine-color-secondary-9)' : 'transparent',
                        transition: 'background-color 0.2s ease, border-color 0.2s ease'
                    }}
                    styles={{
                        root: {
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.03)'
                            }
                        }
                    }}
                >
                    <Grid align="center" gutter="xs">
                        <Grid.Col span={1}>
                            <Group gap={2} justify="center">
                                {column.isPrimaryKey && (
                                    <Tooltip label="Primary Key" position="top" withArrow>
                                        <Box><Key size={12} color="var(--mantine-color-yellow-5)" /></Box>
                                    </Tooltip>
                                )}
                                {column.isForeignKey && (
                                    <Tooltip label="Foreign Key" position="top" withArrow>
                                        <Box><Link2 size={12} color="var(--mantine-color-blue-5)" /></Box>
                                    </Tooltip>
                                )}
                                {!column.isForeignKey && !column.isPrimaryKey && (
                                    <Tooltip label="Normal Column" position="top" withArrow>
                                        <Dot size={10} color="light-dark(var(--mantine-color-gray-9), var(--mantine-color-gray-6))" />
                                    </Tooltip>
                                )}
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text fz="13px" fw={600} style={{
                                color: column.isPrimaryKey
                                    ? 'var(--mantine-color-yellow-4)'
                                    : column.isForeignKey
                                        ? 'var(--mantine-color-blue-4)'
                                        : 'var(--mantine-color-text)',
                                fontFamily: '"JetBrains Mono", monospace'
                            }}>
                                {column.name}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Badge
                                size="xs"
                                variant="light"
                                color="teal"
                                radius="sm"
                                styles={{ root: { textTransform: 'none', fontFamily: '"JetBrains Mono", monospace' } }}
                            >
                                {column.dataType}
                            </Badge>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Group justify="center">
                                {column.isNullable ? (
                                    <Tooltip label="Nullable" position="top" withArrow>
                                        <Box><CheckCircle2 size={12} color="var(--mantine-color-gray-5)" /></Box>
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="NOT NULL" position="top" withArrow>
                                        <Box><AlertCircle size={12} color="var(--mantine-color-red-5)" /></Box>
                                    </Tooltip>
                                )}
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={5}>
                            <Text size="xs" c="dimmed" truncate="end" lineClamp={1}>
                                {d?.description || 'No description'}
                            </Text>
                        </Grid.Col>
                    </Grid>
                </UnstyledButton>
                <Collapse in={isSelected}>
                    <Box px="md" pb="md" bg="var(--mantine-color-secondary-9)">
                        {shouldRenderEditor && (
                            <CustomRichTextEditor
                                icon={<FileText size={16} color="var(--mantine-color-blue-4)" />}
                                initialContent={d?.description || ''}
                                isEditable={isEditing}
                            />
                        )}
                    </Box>
                </Collapse>
                <Divider />
            </Box>
        </motion.div>
    );
};


export const ColumnsDocs = ({ schema, tableName, columns, isEditing }: ColumnsDocsProps) => {
    const setSelected = useDocsPanelStore(state => state.setSelected);
    const selectedItemId = useDocsPanelStore(state => state.selectedItemId);
    const selectedItemType = useDocsPanelStore(state => state.selectedItemType);

    const [expandedColumn, setExpandedColumn] = useState<string | null>(null);

    // Sync expanded column with global selection
    useEffect(() => {
        if (selectedItemType === 'column' && selectedItemId) {
            setExpandedColumn(selectedItemId);
        }
    }, [selectedItemId, selectedItemType]);

    const handleColumnClick = (name: string) => {
        const fullId = `${schema}.${tableName}.${name}`;
        if (expandedColumn === fullId) {
            setExpandedColumn(null); // Just collapse locally
        } else {
            setSelected(fullId, 'column'); // Select globally so right panel picks it up
            setExpandedColumn(fullId);
        }
    };

    return (
        <Stack gap="xs">
            <Group gap="xs">
                <Hash size={16} color="var(--mantine-color-blue-4)" />
                <Text fw={700} size="sm" >Columns</Text>
                <Badge size="xs" variant="light" color="blue" radius="sm">{columns.length}</Badge>
            </Group>

            <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
                <Box px="md" py={6} style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
                    <Grid align="center" gutter="xs">
                        <Grid.Col span={1}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase" ta="center">Keys</Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase">Column Name</Text>
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase">Type</Text>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase" ta="center">Null</Text>
                        </Grid.Col>
                        <Grid.Col span={5}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase">Description</Text>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Divider />

                <Box>
                    {columns.map((column) => (
                        <ColumnRow
                            key={column.name}
                            column={column}
                            isSelected={expandedColumn === `${schema}.${tableName}.${column.name}`}
                            onClick={() => handleColumnClick(column.name)}
                            isEditing={isEditing || false}
                        />
                    ))}
                </Box>
            </Card>
        </Stack>
    );
};
