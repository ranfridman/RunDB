import { Group, Button, Text, ThemeIcon, Divider, ActionIcon } from '@mantine/core';
import { Edit, Check, Settings2 } from 'lucide-react';
import { typeToColor, typeToIcon2 } from '../TypesTheme/TypesTheme';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';

import mockDbData from '../DocsPanel/mockDbData.json';

interface DocsHeaderProps {
    isEditing: boolean;
    onToggleEditing: () => void;
}

export const DocsHeader = ({ isEditing, onToggleEditing }: DocsHeaderProps) => {
    const setSelected = useDocsPanelStore(state => state.setSelected);
    const dbName = mockDbData.database.name;

    return (
        <Group justify="space-between" py={3}>
            <Group align='center' gap={0}>
                <ThemeIcon size={50} pt="xs" variant='transparent' p={0} c={typeToColor.Docs}>
                    {typeToIcon2.Docs}
                </ThemeIcon>
                <Text lh={1} fw={500} fz="h1">Documentation: {dbName}</Text >
            </Group>

            <Group>
                <ActionIcon
                    variant="light"
                    color="gray"
                    size="md"
                    onClick={() => setSelected(mockDbData.schemas[0].name, 'schema')}
                >
                    <Settings2 size={16} />
                </ActionIcon>
                <Button
                    variant={isEditing ? 'light' : 'light'}
                    // color={isEditing ? 'green' : 'gray'}
                    color={'gray'}
                    size="xs"
                    leftSection={isEditing ? <Check size={14} /> : <Edit size={14} />}
                    onClick={onToggleEditing}
                >
                    {isEditing ? 'Stop editing' : 'Enable editing'}
                </Button>
            </Group>
        </Group>
    );
};
