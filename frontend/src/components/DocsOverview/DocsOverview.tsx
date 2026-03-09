import { useState, useMemo } from 'react';
import { Box, Stack, Group, Text, SegmentedControl, Center, Input } from '@mantine/core';
import { LayoutList, LayoutGrid, Search } from 'lucide-react';
import { CustomRichTextEditor } from '../RichTextEditor/CustomRichTextEditor';
import { TablesDocs } from '../TablesDocs/TablesDocs';
import { GridDocs } from '../GridDocs/GridDocs';
import { typeToColor } from '../TypesTheme/TypesTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';
import AnimatedNumber from '../Animations/AnimatedNumber';

export interface DocsOverviewProps {
    isEditing: boolean;
}

interface EditorSection {
    id: string;
    content: string;
}

export const DocsOverview = ({ isEditing }: DocsOverviewProps) => {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [search, setSearch] = useState('');
    const dbData = useDocsPanelStore(state => state.dbData);
    if (!dbData) return null;

    const latestDescription = dbData.database.descriptions?.[dbData.database.descriptions.length - 1]?.description || "";
    const [description, setDescription] = useState<string>(latestDescription);

    const allTables = useMemo(() => {
        return dbData.schemas.flatMap(s => s.tables.map(t => ({ ...t, schema: s.name })));
    }, [dbData]);

    const filteredCount = useMemo(() => {
        if (!search) return allTables.length;
        const q = search.toLowerCase();
        return allTables.filter(t => {
            const descriptions = t.descriptions || [];
            const d = descriptions[descriptions.length - 1];
            return (
                t.name.toLowerCase().includes(q) ||
                (d?.description || '').toLowerCase().includes(q) ||
                (d?.author || '').toLowerCase().includes(q) ||
                (d?.timestamp || '').toLowerCase().includes(q)
            );
        }).length;
    }, [search, allTables]);

    const updateDescription = (newContent: string) => {
        setDescription(newContent);
    };

    return (
        <Stack px="sm" pt="xs"  >
            <Box>
                <CustomRichTextEditor
                    initialContent={description}
                    isEditable={isEditing}
                    onChange={updateDescription}
                />
            </Box>

            <Group justify="space-between" align="center" >
                <Text fw={600} fz="md">
                    Tables (<AnimatedNumber value={filteredCount} />)
                </Text>

                <Group gap="xs">
                    <Input
                        leftSection={<Search size={12} />}
                        placeholder="Filter tables..."
                        size="xs"
                        variant="filled"
                        color={typeToColor['Docs']}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                    />

                    <SegmentedControl
                        value={viewMode}
                        onChange={(value) => setViewMode(value as 'table' | 'grid')}
                        size="xs"
                        radius="xl"
                        data={[
                            {
                                label: (
                                    <Group align="center" gap="3" justify="start" style={{ flexWrap: 'nowrap' }}>
                                        <LayoutList size={14} />
                                        <Text size="xs" fw={500}>List</Text>
                                    </Group>
                                ),
                                value: 'table'
                            },
                            {
                                label: (
                                    <Group align="center" gap="3" justify="start" style={{ flexWrap: 'nowrap' }}>
                                        <LayoutGrid size={14} />
                                        <Text size="xs" fw={500}>Grid</Text>
                                    </Group>
                                ),
                                value: 'grid'
                            },
                        ]}
                        color={typeToColor['Docs']}
                        bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))"
                        style={{
                            border: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
                        }}
                    />
                </Group>
            </Group>

            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {viewMode === 'table' ? (
                        <TablesDocs isEditing={isEditing} externalSearch={search} />
                    ) : (
                        <GridDocs isEditing={isEditing} externalSearch={search} />
                    )}
                </motion.div>
            </AnimatePresence>


        </Stack>
    );
};
