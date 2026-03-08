import { useMemo, lazy, Suspense } from 'react';
import {
    Box, Stack, Group, Text, ThemeIcon, ActionIcon, ScrollArea,
    Badge, Paper, Divider, Timeline,
    Button, Center, Loader
} from '@mantine/core';
import {
    X, Table2, Columns, History, Sparkles, LayoutList,
    ChevronRight, User,
    RotateCcw, AlertCircle, FileText
} from 'lucide-react';
import { useDocsPanelStore } from './DocsPanelStore';
import mockDbData from './mockDbData.json';
import { CustomRichTextEditor } from '../RichTextEditor/CustomRichTextEditor';

const ColumnsDocs = lazy(() => import('../ColumnsDocs/ColumnsDocs').then(m => ({ default: m.ColumnsDocs })));

export const DocsRightPanel = () => {
    const selectedItemId = useDocsPanelStore(state => state.selectedItemId);
    const selectedItemType = useDocsPanelStore(state => state.selectedItemType);
    const setSelected = useDocsPanelStore(state => state.setSelected);
    const isEditing = useDocsPanelStore(state => state.isEditing);

    const itemData = useMemo(() => {
        if (!selectedItemId) return null;
        if (selectedItemType === 'schema') return mockDbData.schemas.find(s => s.name === selectedItemId);
        if (selectedItemType === 'table') {
            for (const s of mockDbData.schemas) {
                const t = s.tables.find(t => t.name === selectedItemId);
                if (t) return { ...t, schema: s.name };
            }
        }
        if (selectedItemType === 'column') {
            for (const s of mockDbData.schemas) {
                for (const t of s.tables) {
                    const c = t.columns.find(c => c.name === selectedItemId);
                    if (c) return { ...c, table: t.name, schema: s.name };
                }
            }
        }
        return null;
    }, [selectedItemId, selectedItemType]);

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

    return (
        <ScrollArea h="82vh" offsetScrollbars scrollbarSize={2}>
            <Stack gap="xl" p="md" bg="var(--mantine-color-secondary-9)">
                {/* Compact Navigation Header */}
                <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ActionIcon variant="light" color="gray" onClick={() => setSelected(null, null)}>
                        <X size={16} />
                    </ActionIcon>
                </Box>

                {/* Path Segment */}
                <Box>
                    <Group gap={4} mb="xs">
                        <ThemeIcon size="xs" variant="transparent" c="blue">
                            {selectedItemType === 'table' ? <Table2 size={12} /> : selectedItemType === 'column' ? <Columns size={12} /> : <LayoutList size={12} />}
                        </ThemeIcon>
                        <Text size="xs" fw={600} c="blue.4">CURRENT VIEW</Text>
                    </Group>
                    <Paper withBorder p="sm" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                        <Group gap="xs" wrap="nowrap">
                            {selectedItemType === 'column' && (
                                <>
                                    <Text size="sm" c="dimmed">{(itemData as any).schema}</Text>
                                    <ChevronRight size={12} color="var(--mantine-color-dark-3)" />
                                    <Text size="sm" c="dimmed">{(itemData as any).table}</Text>
                                    <ChevronRight size={12} color="var(--mantine-color-dark-3)" />
                                </>
                            )}
                            {selectedItemType === 'table' && (
                                <>
                                    <Text size="sm" c="dimmed">{(itemData as any).schema}</Text>
                                    <ChevronRight size={12} color="var(--mantine-color-dark-3)" />
                                </>
                            )}
                            <Text size="sm" fw={700}>{selectedItemId}</Text>
                        </Group>
                    </Paper>
                </Box>

                {/* Table Details */}
                {selectedItemType === 'table' && (
                    <Box>
                        <Group gap="xs" mb="sm">
                            <FileText size={16} color="var(--mantine-color-blue-4)" />
                            <Text size="sm" fw={700}>TABLE DETAILS</Text>
                        </Group>
                        <Paper withBorder p="md" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                            <Suspense fallback={<Center p="md"><Loader size="sm" /></Center>}>
                                <CustomRichTextEditor initialContent={descriptions[0]?.description || ''} isEditable={isEditing} />
                                <Box mt="xl">
                                    <ColumnsDocs columns={(itemData as any).columns} isEditing={isEditing} />
                                </Box>
                            </Suspense>
                        </Paper>
                    </Box>
                )}

                {/* History Versions Section */}
                <Box>
                    <Group justify="space-between" mb="lg">
                        <Group gap="xs">
                            <History size={16} color="var(--mantine-color-blue-4)" />
                            <Text size="sm" fw={700}>VERSION HISTORY</Text>
                        </Group>
                        <Badge variant="light" size="xs">{descriptions.length} Versions</Badge>
                    </Group>

                    <Timeline active={0} bulletSize={24} lineWidth={2} color="blue">
                        {descriptions.map((desc: any, i: number) => (
                            <Timeline.Item
                                key={i}
                                bullet={desc.isAiGenerated ? <Sparkles size={12} /> : <User size={12} />}
                                title={
                                    <Group justify="space-between" wrap="nowrap">
                                        <Text size="sm" fw={600}>{desc.author || 'System'}</Text>
                                        <Text size="xs" c="dimmed">{new Date(desc.timestamp).toLocaleDateString()}</Text>
                                    </Group>
                                }
                            >
                                <Paper withBorder p="xs" mt="xs" radius="sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
                                    <Text size="xs" lineClamp={2} c="dimmed">
                                        {desc.description}
                                    </Text>
                                    <Group justify="flex-end" mt="xs">
                                        <Button
                                            variant="subtle"
                                            size="compact-xs"
                                            leftSection={<RotateCcw size={10} />}
                                            color="blue"
                                        >
                                            Restore
                                        </Button>
                                    </Group>
                                </Paper>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Box>


            </Stack>
        </ScrollArea>
    );
};
