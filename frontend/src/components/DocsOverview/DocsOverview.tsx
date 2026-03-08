import { useState } from 'react';
import { Box, Button, Stack, ActionIcon, Group, Text } from '@mantine/core';
import { Pencil, Plus, Trash } from 'lucide-react';
import { CustomRichTextEditor } from '../RichTextEditor/CustomRichTextEditor';
import { TablesDocs } from '../TablesDocs/TablesDocs';
import { GridDocs } from '../GridDocs/GridDocs';
import { LayoutList, LayoutGrid } from 'lucide-react';

export interface DocsOverviewProps {
    isEditing: boolean;
}

interface EditorSection {
    id: string;
    content: string;
}

export const DocsOverview = ({ isEditing }: DocsOverviewProps) => {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [sections, setSections] = useState<EditorSection[]>([
        { id: crypto.randomUUID(), content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." }
    ]);

    const addSection = () => {
        setSections([...sections, { id: crypto.randomUUID(), content: "" }]);
    };

    const removeSection = (idToRemove: string) => {
        setSections(sections.filter(section => section.id !== idToRemove));
    };

    const updateSectionContent = (id: string, newContent: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, content: newContent } : section
        ));
    };

    return (
        <Stack >
            {sections.map(section => (
                <Box key={section.id} >
                    {isEditing && sections.length > 1 && (
                        <Group justify="flex-end" mb="xs">
                            <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => removeSection(section.id)}
                                size="sm"
                            >
                                <Trash size={14} />
                            </ActionIcon>
                        </Group>
                    )}
                    <CustomRichTextEditor
                        initialContent={section.content}
                        isEditable={isEditing}
                        onChange={(content) => updateSectionContent(section.id, content)}
                    />
                </Box>
            ))}

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

            {isEditing && (
                <Button
                    variant="light"
                    leftSection={<Plus size={16} />}
                    onClick={addSection}
                    fullWidth
                    mt="md"
                    styles={{
                        root: { borderStyle: 'dashed', borderWidth: 1 }
                    }}
                >
                    Add Section
                </Button>
            )}
        </Stack>
    );
};
