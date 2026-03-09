import { useState } from 'react';
import { Box, Stack, ActionIcon, Group, Text } from '@mantine/core';
import { Pencil, Trash } from 'lucide-react';
import { CustomRichTextEditor } from '../RichTextEditor/CustomRichTextEditor';
import { TablesDocs } from '../TablesDocs/TablesDocs';
import { GridDocs } from '../GridDocs/GridDocs';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';

export interface DocsOverviewProps {
    isEditing: boolean;
}

interface EditorSection {
    id: string;
    content: string;
}

export const DocsOverview = ({ isEditing }: DocsOverviewProps) => {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const dbData = useDocsPanelStore(state => state.dbData);

    const latestDescription = dbData.database.descriptions[dbData.database.descriptions.length - 1]?.description || "";

    const [description, setDescription] = useState<string>(latestDescription);

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

            <Group justify="flex-end" mb="xs">
                <ActionIcon.Group>
                    <ActionIcon
                        variant={viewMode === 'table' ? 'filled' : 'default'}
                        onClick={() => setViewMode('table')}
                        size="sm"
                    >
                        <LayoutList size={14} />
                    </ActionIcon>
                    <ActionIcon
                        variant={viewMode === 'grid' ? 'filled' : 'default'}
                        onClick={() => setViewMode('grid')}
                        size="sm"
                    >
                        <LayoutGrid size={14} />
                    </ActionIcon>
                </ActionIcon.Group>
            </Group>

            {viewMode === 'table' ? (
                <TablesDocs isEditing={isEditing} />
            ) : (
                <GridDocs isEditing={isEditing} />
            )}


        </Stack>
    );
};
