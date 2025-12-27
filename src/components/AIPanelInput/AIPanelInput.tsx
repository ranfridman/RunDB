import { ActionIcon, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { X } from "lucide-react";


export const AIPanelInput: React.FC = () => {
    return (
        <>
            <Stack p="sm" pt="xs" pb="0" gap="xs" w="100%" >
                <Group justify="space-between" align="center" gap={0} px="sm" py="0">
                    <Group gap={0}>
                        <Title fz="h2">Graph Setup</Title>
                        <Text c="dimmed" fz="xs">Enter your graph code here</Text>
                    </Group>
                    <ActionIcon size="xs" variant="subtle">
                        <X />
                    </ActionIcon>
                </Group>
                <Textarea color="red" placeholder="Enter your graph code here" />
            </Stack>
        </>
    );
}