import { useState, useMemo, useEffect, memo } from 'react';
import { Box, Card, Text, Group, ThemeIcon, Stack, Grid, Divider, Avatar, UnstyledButton, Badge } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { typeToColor, typeToIcon2 } from '../TypesTheme/TypesTheme';
import { Bot, Database } from 'lucide-react';
import { useDocsPanelStore, type DbData } from '../DocsPanel/DocsPanelStore';

const BATCH = 15;

// ---- Single row (memoised, panel content only mounts when expanded) ----

const TableRow = memo(({ rawTable, isSelected, onClick }: {
    rawTable: DbData['schemas'][number]['tables'][number] & { schema: string };
    isSelected: boolean;
    onClick: () => void;
}) => {
    const descriptions = rawTable.descriptions || [];
    const d = descriptions[descriptions.length - 1];

    return (
        <motion.div
            layout
            animate={{ x: isSelected ? 2 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <UnstyledButton
                w="100%"
                p="md"
                onClick={onClick}
                style={{
                    backgroundColor: isSelected ? 'var(--mantine-color-secondary-9)' : 'transparent',
                    borderBottom: '1px solid var(--mantine-color-dark-4)',
                    borderLeft: isSelected ? '3px solid var(--mantine-color-blue-6)' : '3px solid transparent',
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
                <Grid align="center" gutter="md">
                    <Grid.Col span={3}>
                        <Group justify="space-between" >
                            <Group gap="sm">
                                <ThemeIcon size={28} variant="transparent" p={0} c={typeToColor['Docs']}>
                                    {typeToIcon2.Table}
                                </ThemeIcon>
                                <Box >
                                    <Text fw={600} size="h5" lineClamp={1}>{rawTable.name}</Text>
                                    <Text size="10px" c="blue.4" fw={700} tt="uppercase">{rawTable.schema}</Text>
                                </Box>
                            </Group>
                            {/* <Badge size="xs" variant="light" color="blue">{rawTable.schema}</Badge> */}
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Text size="sm" c="dimmed" truncate="end">{d?.description || 'No description'}</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Text size="sm" c="dimmed" truncate="end">{d?.timestamp}</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Group gap="xs" wrap="nowrap">
                            <Avatar name={d?.author} size="sm" radius="xl" alt={d?.author} color="initials" style={{ flexShrink: 0 }}>
                                {d?.isAiGenerated && <Bot size={16} />}
                            </Avatar>
                            <Text size="sm" fw={500} truncate="end">{d?.author}</Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={1} style={{ textAlign: 'right' }}>
                    </Grid.Col>
                </Grid>
            </UnstyledButton>
        </motion.div>
    );
});

// ---- Main ----

export interface TablesDocsProps {
    isEditing?: boolean;
    externalSearch?: string;
}

export const TablesDocs = ({ isEditing: isEditingProp, externalSearch }: TablesDocsProps) => {
    const selectedItemId = useDocsPanelStore(s => s.selectedItemId);
    const setSelected = useDocsPanelStore(s => s.setSelected);
    const storeIsEditing = useDocsPanelStore(s => s.isEditing);
    const dbData = useDocsPanelStore(s => s.dbData);
    if (!dbData) return null;
    const isEditing = isEditingProp ?? storeIsEditing;

    const allTables = useMemo(() => {
        return dbData.schemas.flatMap(s => s.tables.map(t => ({ ...t, schema: s.name })));
    }, [dbData]);

    const rawTables = allTables;

    const [count, setCount] = useState(BATCH);

    const search = externalSearch ?? '';

    // Reset count when search changes
    useEffect(() => {
        setCount(BATCH);
    }, [search]);

    // Mantine's useIntersection — auto-load more when sentinel is visible
    const { ref: sentinelRef, entry } = useIntersection({ rootMargin: '400px' });

    useEffect(() => {
        if (entry?.isIntersecting) {
            setCount(c => Math.min(c + BATCH, rawTables.length));
        }
    }, [entry?.isIntersecting]);

    const filtered = useMemo(() => {
        if (!search) return rawTables;
        const q = search.toLowerCase();
        return rawTables.filter(t => {
            const d = t.descriptions[t.descriptions.length - 1];
            return (
                t.name.toLowerCase().includes(q) ||
                (d?.description || '').toLowerCase().includes(q) ||
                (d?.author || '').toLowerCase().includes(q) ||
                (d?.timestamp || '').toLowerCase().includes(q)
            );
        });
    }, [search, rawTables]);

    const visible = filtered.slice(0, count);

    return (
        <Stack gap="xs">
            <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
                <Box px="md" py="xs" style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
                    <Grid align="center" gutter="md">
                        <Grid.Col span={3}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Table Name</Text></Grid.Col>
                        <Grid.Col span={4}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Description</Text></Grid.Col>
                        <Grid.Col span={2}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Created At</Text></Grid.Col>
                        <Grid.Col span={2}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Author</Text></Grid.Col>
                        <Grid.Col span={1} style={{ textAlign: 'right' }}></Grid.Col>
                    </Grid>
                </Box>
                <Divider />

                <Box>
                    {visible.map(t => (
                        <TableRow
                            key={`${t.schema}.${t.name}`}
                            rawTable={t}
                            isSelected={selectedItemId === `${t.schema}.${t.name}`}
                            onClick={() => setSelected(`${t.schema}.${t.name}`, 'table')}
                        />
                    ))}
                </Box>
            </Card>
            {count < filtered.length && <div ref={sentinelRef} style={{ height: 1 }} />}
        </Stack>
    );
};
