import { useState, useMemo, useEffect, memo } from 'react';
import { Card, Stack, Loader, Center, SimpleGrid } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';
import { TableGridItem } from '../TableGridItem/TableGridItem';

const BATCH = 15;

const GridCard = memo(({ rawTable, isSelected, onClick }: any) => {
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
                <TableGridItem table={rawTable} />
            </Card>
        </motion.div>
    );
});

export interface GridDocsProps {
    isEditing?: boolean;
    externalSearch?: string;
}

export const GridDocs = ({ isEditing: isEditingProp, externalSearch }: GridDocsProps) => {
    const storeIsEditing = useDocsPanelStore(s => s.isEditing);
    const isEditing = isEditingProp ?? storeIsEditing;
    const selectedItemId = useDocsPanelStore(s => s.selectedItemId);
    const setSelected = useDocsPanelStore(s => s.setSelected);
    const dbData = useDocsPanelStore(s => s.dbData);

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
