import { useState, useMemo, useEffect, memo } from 'react';
import { Box, Card, Text, Group, ThemeIcon, Stack, Grid, Divider, Avatar, Input, UnstyledButton } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { typeToColor, typeToIcon2 } from '../TypesTheme/TypesTheme';
import { Bot, Search } from 'lucide-react';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';

import mockDbData from '../DocsPanel/mockDbData.json';
import AnimatedNumber from '../Animations/AnimatedNumber';

const rawTables = mockDbData.schemas[0].tables;

const BATCH = 15;

// ---- Single row (memoised, panel content only mounts when expanded) ----

const TableRow = memo(({ rawTable, isSelected, onClick }: {
    rawTable: (typeof rawTables)[number];
    isSelected: boolean;
    onClick: () => void;
}) => {
    const d = rawTable.descriptions[0];

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
                        <Group gap="sm">
                            <ThemeIcon size={28} variant="transparent" p={0} c={typeToColor['Docs']}>
                                {typeToIcon2.Table}
                            </ThemeIcon>
                            <Text fw={600} size="h5">{rawTable.name}</Text>
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
}

export const TablesDocs = ({ isEditing: isEditingProp }: TablesDocsProps) => {
    const selectedItemId = useDocsPanelStore(s => s.selectedItemId);
    const setSelected = useDocsPanelStore(s => s.setSelected);
    const storeIsEditing = useDocsPanelStore(s => s.isEditing);
    const isEditing = isEditingProp ?? storeIsEditing;

    const [search, setSearch] = useState('');
    const [count, setCount] = useState(BATCH);

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
        return rawTables.filter(t =>
            t.name.toLowerCase().includes(q) ||
            (t.descriptions[0]?.description || '').toLowerCase().includes(q) ||
            (t.descriptions[0]?.author || '').toLowerCase().includes(q) ||
            (t.descriptions[0]?.timestamp || '').toLowerCase().includes(q)
        );
    }, [search]);

    const visible = filtered.slice(0, count);

    return (
        <Stack gap="xs">
            <Group justify="space-between">
                <Text fw={600} fz="md">Tables (
                    <AnimatedNumber value={filtered.length} />
                    )</Text>
                <Input
                    leftSection={<Search size={12} />}
                    placeholder="Filter tables..."
                    size="xs"
                    variant="filled"
                    color={typeToColor['Docs']}
                    value={search}
                    onChange={(e) => { setSearch(e.currentTarget.value); setCount(BATCH); }}
                />
            </Group>
            <Card withBorder p={0} radius="md">
                <Box px="md" py="xs" style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
                    <Grid align="center" gutter="md">
                        <Grid.Col span={3}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Table Name</Text></Grid.Col>
                        <Grid.Col span={4}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Description</Text></Grid.Col>
                        <Grid.Col span={2}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Created At</Text></Grid.Col>
                        <Grid.Col span={2}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Author</Text></Grid.Col>
                        <Grid.Col span={1} style={{ textAlign: 'right' }}><Text size="xs" fw={700} c="dimmed" tt="uppercase">Actions</Text></Grid.Col>
                    </Grid>
                </Box>
                <Divider />

                <Box>
                    {visible.map(t => (
                        <TableRow
                            key={t.name}
                            rawTable={t}
                            isSelected={selectedItemId === t.name}
                            onClick={() => setSelected(t.name, 'table')}
                        />
                    ))}
                </Box>

                {count < filtered.length && <div ref={sentinelRef} style={{ height: 1 }} />}
            </Card>
        </Stack>
    );
};
