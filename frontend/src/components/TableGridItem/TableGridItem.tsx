import { Group, ThemeIcon, Text, Avatar, Box, Badge } from '@mantine/core';
import { Bot, Database } from 'lucide-react';
import { typeToColor, typeToIcon2 } from '../TypesTheme/TypesTheme';
import { useDocsPanelStore, type DbData } from '../DocsPanel/DocsPanelStore';

interface TableGridItemProps {
    table: DbData['schemas'][number]['tables'][number];
}

export const TableGridItem = ({ table }: TableGridItemProps) => {
    const d = table.descriptions?.[table.descriptions.length - 1];

    return (
        <>
            <Group justify="space-between" mb="xs">
                <Group gap="sm">
                    <ThemeIcon size={28} variant="transparent" p={0} c={typeToColor['Docs']}>
                        {typeToIcon2.Table}
                    </ThemeIcon>
                    <Box>
                        <Text fw={600} size="h5" lineClamp={1}>{table.name}</Text>
                        <Text size="10px" c="blue.4" fw={700} tt="uppercase">{(table as any).schema}</Text>
                    </Box>
                </Group>
                {/* <Badge size="xs" variant="light" color="blue">{(table as any).schema}</Badge> */}
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
                <Text size="xs" c="dimmed" truncate="end" style={{ flexShrink: 0 }}>
                    {d?.timestamp ? new Date(d.timestamp).toLocaleDateString() : ''}
                </Text>
            </Group>
        </>
    );
};
