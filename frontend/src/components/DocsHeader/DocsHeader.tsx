import { Group, Button, Text, ThemeIcon, Divider, ActionIcon } from '@mantine/core';
import { Edit, Check, Settings2 } from 'lucide-react';
import { typeToColor, typeToIcon2 } from '../TypesTheme/TypesTheme';
import { useDocsPanelStore } from '../DocsPanel/DocsPanelStore';

interface DocsHeaderProps {
    isEditing: boolean;
    onToggleEditing: () => void;
}

export const DocsHeader = ({ isEditing, onToggleEditing }: DocsHeaderProps) => {
    const setSelected = useDocsPanelStore(state => state.setSelected);
    const dbData = useDocsPanelStore(state => state.dbData);
    const dbName = dbData?.database?.name || '';

    return (
        <Group justify="space-between" py={3}>
            <Group align='center' gap={0}>
                <ThemeIcon size={50} pt="xs" variant='transparent' p={0} c={typeToColor.Docs}>
                    {typeToIcon2.Docs}
                </ThemeIcon>
                <Text lh={0.5} fw={500} fz="h1">Documentation: {dbName}</Text >
            </Group>

            <Group>
                <ActionIcon
                    variant="light"
                    color="gray"
                    size="md"
                    onClick={() => dbData?.schemas?.[0] && setSelected(dbData.schemas[0].name, 'schema')}
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
