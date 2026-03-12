import { useMemo, lazy, Suspense, useState, useEffect, useRef } from 'react';
import {
    Box, Stack, Group, Text, ThemeIcon, ActionIcon, ScrollArea,
    Badge, Paper, Divider,
    Button, Center, Loader,
    Avatar, Card, Grid, Tooltip, UnstyledButton
} from '@mantine/core';
import {
    X, Table2, Columns, LayoutList,
    ChevronRight, User, GitBranch,
    AlertCircle, FileText,
    ArrowDownRight, ArrowUpRight, Link2, Database,
    Layers, Hash
} from 'lucide-react';
import { useDocsPanelStore } from './DocsPanelStore';
import { CustomRichTextEditor } from '../RichTextEditor/CustomRichTextEditor';

const ColumnsDocs = lazy(() => import('../ColumnsDocs/ColumnsDocs').then(m => ({ default: m.ColumnsDocs })));

/* ─── Connections Card ──────────────────────────────────────────── */

interface ConnectionItem {
    schema: string;
    table: string;
    column: string;
    referencedColumn: string;
}

const ConnectionRow = ({ item, direction, onNavigate }: {
    item: ConnectionItem;
    direction: 'depends' | 'dependent';
    onNavigate: (tableName: string) => void;
}) => (
    <UnstyledButton
        w="100%"
        px="md"
        py={6}
        onClick={() => onNavigate(item.table)}
        style={{
            borderBottom: '1px solid var(--mantine-color-dark-6)',
            transition: 'background-color 0.2s ease'
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
                <Group justify="center">
                    {direction === 'depends' ? (
                        <Tooltip label="This table depends on" withArrow>
                            <Box><ArrowUpRight size={14} color="var(--mantine-color-orange-5)" /></Box>
                        </Tooltip>
                    ) : (
                        <Tooltip label="Referenced by" withArrow>
                            <Box><ArrowDownRight size={14} color="var(--mantine-color-green-5)" /></Box>
                        </Tooltip>
                    )}
                </Group>
            </Grid.Col>
            <Grid.Col span={4}>
                <Group gap={4} wrap="nowrap">
                    <Table2 size={12} color="var(--mantine-color-blue-4)" />
                    <Text size="xs" fw={600} truncate="end" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {item.table}
                    </Text>
                </Group>
            </Grid.Col>
            <Grid.Col span={3}>
                <Text size="xs" c="dimmed" ff="monospace" truncate="end">
                    {item.column}
                </Text>
            </Grid.Col>
            <Grid.Col span={1}>
                <Group justify="center">
                    <Link2 size={10} color="var(--mantine-color-dimmed)" />
                </Group>
            </Grid.Col>
            <Grid.Col span={3}>
                <Text size="xs" c="dimmed" ff="monospace" truncate="end">
                    {item.referencedColumn}
                </Text>
            </Grid.Col>
        </Grid>
    </UnstyledButton>
);

const ConnectionsSection = ({ dependsOn, dependents, onNavigate }: {
    dependsOn: ConnectionItem[];
    dependents: ConnectionItem[];
    onNavigate: (tableName: string) => void;
}) => {
    const totalConnections = dependsOn.length + dependents.length;
    if (totalConnections === 0) return null;

    return (
        <Stack gap="xs">
            <Group gap="xs">
                <GitBranch size={16} color="var(--mantine-color-blue-4)" />
                <Text fw={700} size="sm" >Connections</Text>
                <Badge size="xs" variant="light" color="blue" radius="sm">{totalConnections}</Badge>
            </Group>

            <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
                {/* Header Row */}
                <Box px="md" py={6} style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
                    <Grid align="center" gutter="xs">
                        <Grid.Col span={1}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase" ta="center">Dir</Text>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase">Table</Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase">FK Column</Text>
                        </Grid.Col>
                        <Grid.Col span={1}></Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="9px" fw={800} c="dimmed" tt="uppercase">References</Text>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Divider />

                {/* Depends On */}
                {dependsOn.map((item, i) => (
                    <ConnectionRow key={`dep-${i}`} item={item} direction="depends" onNavigate={onNavigate} />
                ))}

                {/* Dependents */}
                {dependents.map((item, i) => (
                    <ConnectionRow key={`ref-${i}`} item={item} direction="dependent" onNavigate={onNavigate} />
                ))}
            </Card>
        </Stack>
    );
};



/* ─── Main Panel ────────────────────────────────────────────────── */

export const DocsRightPanel = () => {
    const selectedItemId = useDocsPanelStore(state => state.selectedItemId);
    const selectedItemType = useDocsPanelStore(state => state.selectedItemType);
    const setSelected = useDocsPanelStore(state => state.setSelected);
    const setActiveTab = useDocsPanelStore(state => state.setActiveTab);
    const isEditing = useDocsPanelStore(state => state.isEditing);
    const dbData = useDocsPanelStore(state => state.dbData);
    if (!dbData) return null;

    // Resolve the selected item and its parent table context in one go
    const { itemData, tableData } = useMemo(() => {
        if (!selectedItemId) return { itemData: null, tableData: null };

        const parts = selectedItemId.split('.');
        const db = dbData;

        // 1. Try resolving via the unique path (schema.table.column)
        let s = db.schemas.find(x => x.name === parts[0]);
        let t = s?.tables.find(x => x.name === parts[1]);
        let c = t?.columns.find(x => x.name === parts[2]);

        // 2. Fallback for flat names (if the ID wasn't a full path)
        if (!s && parts.length === 1) {
            for (const schema of db.schemas) {
                if (selectedItemType === 'schema' && schema.name === selectedItemId) {
                    s = schema;
                    break;
                }
                if (selectedItemType === 'table') {
                    const found = schema.tables.find(x => x.name === selectedItemId);
                    if (found) { s = schema; t = found; break; }
                }
                if (selectedItemType === 'column') {
                    for (const table of schema.tables) {
                        const found = table.columns.find(x => x.name === selectedItemId);
                        if (found) { s = schema; t = table; c = found; break; }
                    }
                }
            }
        }

        const resolvedItem = (selectedItemType === 'schema' ? s :
            selectedItemType === 'table' ? (t ? { ...t, schema: s?.name } : null) :
                (c ? { ...c, table: t?.name, schema: s?.name } : null)) as any;

        const resolvedTable = (t ? { ...t, schema: s?.name } : null) as any;

        return { itemData: resolvedItem, tableData: resolvedTable };
    }, [selectedItemId, selectedItemType, dbData]);

    if (!selectedItemId) return null;

    if (!itemData) return (
        <Center h="100%">
            <Stack align="center" gap="sm" c="dimmed">
                <AlertCircle size={40} strokeWidth={1} />
                <Text size="sm">Item '{selectedItemId}' not found in documentation</Text>
                <Button variant="light" size="xs" onClick={() => setSelected(null, null)}>Close Panel</Button>
            </Stack>
        </Center>
    );

    const descriptions = (tableData as any)?.descriptions || [];
    const dependsOn: ConnectionItem[] = (tableData as any)?.dependsOn || [];
    const dependents: ConnectionItem[] = (tableData as any)?.dependents || [];

    const handleNavigateToTable = (tableName: string) => {
        setSelected(tableName, 'table');
    };

    const itemIcon = (selectedItemType === 'table' || selectedItemType === 'column')
        ? <Table2 size={14} />
        : <Layers size={14} />;

    const viewportRef = useRef<HTMLDivElement>(null);

    // Scroll to top when a table is selected
    useEffect(() => {
        if (selectedItemType === 'table' && viewportRef.current) {
            viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedItemId, selectedItemType]);

    return (
        <ScrollArea h="82vh" offsetScrollbars scrollbarSize={2} w="100%" viewportRef={viewportRef}>
            <Stack p="md" gap="lg">

                {/* ─── Header ─────────────────────────────────── */}
                <Box>
                    <Group justify="space-between" align="flex-start">
                        <Box>
                            <Group gap={6} mb={4}>
                                <ThemeIcon size={20} variant="light" color="blue" radius="sm">
                                    {itemIcon}
                                </ThemeIcon>
                                <Badge
                                    size="xs"
                                    variant="dot"
                                    color="blue"
                                    styles={{ root: { textTransform: 'uppercase' } }}
                                >
                                    {(selectedItemType === 'table' || selectedItemType === 'column') ? 'table' : selectedItemType}
                                </Badge>
                            </Group>

                            {/* Breadcrumb & Title */}
                            <Group gap={4} wrap="nowrap" mt={6}>
                                {(selectedItemType === 'table' || selectedItemType === 'column') && (
                                    <>
                                        <Text size="xs" c="dimmed">{tableData?.schema}</Text>
                                        <ChevronRight size={10} color="var(--mantine-color-dark-3)" />
                                    </>
                                )}
                                <Text size="md" fw={700} c={selectedItemType !== 'schema' ? 'blue.4' : undefined}>
                                    {selectedItemType === 'schema' ? itemData.name : tableData?.name}
                                </Text>
                            </Group>

                        </Box>

                        <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => setSelected(null, null)}>
                            <X size={14} />
                        </ActionIcon>
                    </Group>

                    {/* Quick stats */}
                    {(selectedItemType === 'table' || selectedItemType === 'column') && tableData && (
                        <Group gap="lg" mt="sm">
                            <Group gap={4}>
                                <Hash size={12} color="var(--mantine-color-dimmed)" />
                                <Text size="xs" c="dimmed">
                                    {(tableData as any).columns?.length || 0} columns
                                </Text>
                            </Group>
                            <Group gap={4}>
                                <GitBranch size={12} color="var(--mantine-color-dimmed)" />
                                <Text size="xs" c="dimmed">
                                    {dependsOn.length + dependents.length} connections
                                </Text>
                            </Group>

                        </Group>
                    )}
                </Box>

                <Divider />

                {/* ─── Table Details ───────────────────────────── */}
                {(selectedItemType === 'table' || selectedItemType === 'column') && tableData && (
                    <Suspense fallback={<Center p="md"><Loader size="sm" /></Center>}>

                        {/* Description Editor */}

                        <CustomRichTextEditor
                            icon={<FileText size={16} color="var(--mantine-color-blue-4)" />}
                            // rightSettings={
                            // <Avatar size="sm" color="initials" name={descriptions[descriptions.length - 1]?.author || 'Unknown'} />
                            // }
                            initialContent={descriptions[descriptions.length - 1]?.description || ''}
                            isEditable={isEditing}
                        />

                        {/* Connections Section */}
                        <ConnectionsSection
                            dependsOn={dependsOn}
                            dependents={dependents}
                            onNavigate={handleNavigateToTable}
                        />

                        {/* Columns Section */}
                        <ColumnsDocs
                            schema={tableData.schema}
                            tableName={tableData.name}
                            columns={(tableData as any).columns}
                            isEditing={isEditing}
                        />

                    </Suspense>
                )}



            </Stack>
        </ScrollArea>
    );
};
