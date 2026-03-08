import { useState, useMemo, useEffect, memo } from 'react';
import { Card, Text, Group, ThemeIcon, Stack, Avatar, Input, Loader, Center, SimpleGrid } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { typeToColor, typeToIcon2 } from '../TypesTheme/TypesTheme';
import { Bot, Search } from 'lucide-react';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';

import mockDbData from '../DocsPanel/mockDbData.json';
import AnimatedNumber from '../Animations/AnimatedNumber';

const rawTables = mockDbData.schemas[0].tables;

const BATCH = 15;

const GridCard = memo(({ rawTable, isSelected, onClick }: any) => {
    const d = rawTable.descriptions[0];

    return (
        <motion.div
            layout
            animate={{ scale: isSelected ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ height: '100%' }}
        >
            <Card
                withBorder
                padding="md"
                radius="md"
                component="button"
                onClick={onClick}
                style={{
                    height: '100%',
                    cursor: 'pointer',
                    textAlign: 'left',
                    backgroundColor: isSelected ? 'var(--mantine-color-secondary-9)' : 'var(--mantine-color-body)',
                    borderColor: isSelected ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-dark-4)',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                    transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
            >
                <Group justify="space-between" mb="xs">
                    <Group gap="sm">
                        <ThemeIcon size={28} variant="transparent" p={0} c={typeToColor['Docs']}>
                            {typeToIcon2.Table}
                        </ThemeIcon>
                        <Text fw={600} size="h5">{rawTable.name}</Text>
                    </Group>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={2} mb="md" style={{ minHeight: 40 }}>
                    {d?.description || 'No description'}
                </Text>

                <Group justify="space-between" mt="auto" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                        <Avatar name={d?.author} size="sm" radius="xl" alt={d?.author} color="initials" style={{ flexShrink: 0 }}>
                            {d?.isAiGenerated && <Bot size={16} />}
                        </Avatar>
                        <Text size="xs" fw={500} truncate="end">{d?.author}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" truncate="end" style={{ flexShrink: 0 }}>{d?.timestamp}</Text>
                </Group>
            </Card>
        </motion.div>
    );
});

export interface GridDocsProps {
    isEditing?: boolean;
}

export const GridDocs = ({ isEditing: isEditingProp }: GridDocsProps) => {
    const storeIsEditing = useDocsPanelStore(s => s.isEditing);
    const isEditing = isEditingProp ?? storeIsEditing;
    const selectedItemId = useDocsPanelStore(s => s.selectedItemId);
    const setSelected = useDocsPanelStore(s => s.setSelected);

    const [search, setSearch] = useState('');
    const [count, setCount] = useState(BATCH);

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

            <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
                {visible.map((t: any) => (
                    <GridCard
                        key={t.name}
                        rawTable={t}
                        isSelected={selectedItemId === t.name}
                        onClick={() => setSelected(t.name, 'table')}
                    />
                ))}
            </SimpleGrid>

            {count < filtered.length && <div ref={sentinelRef} style={{ height: 1 }} />}
        </Stack>
    );
};
