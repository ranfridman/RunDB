import { useMemo, lazy, Suspense, useState } from 'react';
import {
    Box, Stack, Group, Text, ThemeIcon, ActionIcon, ScrollArea,
    Badge, Paper, Divider, Collapse,
    Button, Center, Loader,
    Avatar, Card, Grid, Tooltip, UnstyledButton
} from '@mantine/core';
import {
    X, Table2, Columns, History, Sparkles, LayoutList,
    ChevronRight, User, GitBranch,
    ChevronDown, ChevronUp,
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
                <Text fw={700} size="sm" tt="uppercase">Connections</Text>
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

/* ─── History Section (collapsed by default) ────────────────────── */

const HistorySection = ({ descriptions }: { descriptions: any[] }) => {
    const [opened, setOpened] = useState(false);

    return (
        <Stack gap="xs">
            <UnstyledButton onClick={() => setOpened(o => !o)} w="100%">
                <Group justify="space-between">
                    <Group gap="xs">
                        <History size={16} color="var(--mantine-color-blue-4)" />
                        <Text fw={700} size="sm" tt="uppercase">History</Text>
                        <Badge size="xs" variant="light" color="blue" radius="sm">
                            {descriptions.length} versions
                        </Badge>
                    </Group>
                    {opened
                        ? <ChevronUp size={16} color="var(--mantine-color-dimmed)" />
                        : <ChevronDown size={16} color="var(--mantine-color-dimmed)" />
                    }
                </Group>
            </UnstyledButton>

            <Collapse in={opened}>
                <Stack gap={4}>
                    {[...descriptions].reverse().map((d: any, i: number) => (
                        <CustomRichTextEditor
                            key={i}
                            rightSettings={
                                <Group gap="xs" wrap="nowrap">
                                    <Group gap={4} wrap="nowrap">
                                        {d.isAiGenerated && <Sparkles size={10} color="var(--mantine-color-violet-4)" />}
                                        <Text size="xs" c="dimmed">
                                            {new Date(d.timestamp).toLocaleDateString()}
                                        </Text>
                                    </Group>
                                    <Avatar size="sm" color="initials" name={d.author} />
                                </Group>
                            }
                            initialContent={d.description}
                            isEditable={false}
                        />
                    ))}
                </Stack>
            </Collapse>
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

    const itemData = useMemo(() => {
        if (!selectedItemId) return null;
        if (selectedItemType === 'schema') return dbData.schemas.find(s => s.name === selectedItemId);
        if (selectedItemType === 'table') {
            for (const s of dbData.schemas) {
                const t = s.tables.find(t => t.name === selectedItemId);
                if (t) return { ...t, schema: s.name };
            }
        }
        if (selectedItemType === 'column') {
            for (const s of dbData.schemas) {
                for (const t of s.tables) {
                    const c = t.columns.find(c => c.name === selectedItemId);
                    if (c) return { ...c, table: t.name, schema: s.name };
                }
            }
        }
        return null;
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

    const descriptions = (itemData as any).descriptions || [];
    const dependsOn: ConnectionItem[] = (itemData as any).dependsOn || [];
    const dependents: ConnectionItem[] = (itemData as any).dependents || [];

    const handleNavigateToTable = (tableName: string) => {
        setSelected(tableName, 'table');
    };

    const itemIcon = selectedItemType === 'table'
        ? <Table2 size={14} />
        : selectedItemType === 'column'
            ? <Columns size={14} />
            : <Layers size={14} />;

    return (
        <ScrollArea h="82vh" offsetScrollbars scrollbarSize={2} w="100%" >
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
                                    {selectedItemType}
                                </Badge>
                            </Group>

                            {/* Breadcrumb */}
                            <Group gap={4} wrap="nowrap" mt={6}>
                                {selectedItemType === 'column' && (
                                    <>
                                        <UnstyledButton onClick={() => { }}>
                                            <Text size="xs" c="dimmed" style={{ '&:hover': { textDecoration: 'underline' } }}>
                                                {(itemData as any).schema}
                                            </Text>
                                        </UnstyledButton>
                                        <ChevronRight size={10} color="var(--mantine-color-dark-3)" />
                                        <UnstyledButton onClick={() => handleNavigateToTable((itemData as any).table)}>
                                            <Text size="xs" c="blue.4" fw={500} style={{ cursor: 'pointer' }}>
                                                {(itemData as any).table}
                                            </Text>
                                        </UnstyledButton>
                                        <ChevronRight size={10} color="var(--mantine-color-dark-3)" />
                                    </>
                                )}
                                {selectedItemType === 'table' && (
                                    <>
                                        <Text size="xs" c="dimmed">{(itemData as any).schema}</Text>
                                        <ChevronRight size={10} color="var(--mantine-color-dark-3)" />
                                    </>
                                )}
                                <Text size="md" fw={700}>{selectedItemId}</Text>
                            </Group>
                        </Box>

                        <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => setSelected(null, null)}>
                            <X size={14} />
                        </ActionIcon>
                    </Group>

                    {/* Quick stats */}
                    {selectedItemType === 'table' && (
                        <Group gap="lg" mt="sm">
                            <Group gap={4}>
                                <Hash size={12} color="var(--mantine-color-dimmed)" />
                                <Text size="xs" c="dimmed">
                                    {(itemData as any).columns?.length || 0} columns
                                </Text>
                            </Group>
                            <Group gap={4}>
                                <GitBranch size={12} color="var(--mantine-color-dimmed)" />
                                <Text size="xs" c="dimmed">
                                    {dependsOn.length + dependents.length} connections
                                </Text>
                            </Group>
                            <Group gap={4}>
                                <History size={12} color="var(--mantine-color-dimmed)" />
                                <Text size="xs" c="dimmed">
                                    {descriptions.length} versions
                                </Text>
                            </Group>
                        </Group>
                    )}
                </Box>

                <Divider />

                {/* ─── Table Details ───────────────────────────── */}
                {selectedItemType === 'table' && (
                    <Suspense fallback={<Center p="md"><Loader size="sm" /></Center>}>

                        {/* Description Editor */}
                        <Stack gap="xs">
                            <Group gap="xs">
                                <FileText size={16} color="var(--mantine-color-blue-4)" />
                                <Text fw={700} size="sm" tt="uppercase">Description</Text>
                            </Group>
                            <CustomRichTextEditor
                                rightSettings={
                                    <Avatar.Group spacing="xs" >
                                        <Avatar size="sm" color="initials" name="Ran" />
                                        <Avatar size="sm" color="initials" name="John Doe" />
                                        <Avatar size="sm" color="initials" name="Doe" />
                                        <Avatar size="sm" color="initials" name="Doe" />
                                        <Avatar size="sm" color="initials" name="Doe" />
                                        <Avatar size="sm" color="initials" name="Doe" />
                                    </Avatar.Group>
                                }
                                initialContent={descriptions[descriptions.length - 1]?.description || ''}
                                isEditable={isEditing}
                            />
                        </Stack>

                        {/* Connections Section */}
                        <ConnectionsSection
                            dependsOn={dependsOn}
                            dependents={dependents}
                            onNavigate={handleNavigateToTable}
                        />

                        {/* Columns Section */}
                        <ColumnsDocs columns={(itemData as any).columns} isEditing={isEditing} />

                    </Suspense>
                )}

                {/* ─── History (collapsed by default) ─────────── */}
                {descriptions.length > 0 && (
                    <HistorySection descriptions={descriptions} />
                )}

            </Stack>
        </ScrollArea>
    );
};
