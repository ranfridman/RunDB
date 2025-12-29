import { ActionIcon, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { X } from "lucide-react";

interface AIPanelInputProps {
    type: string;
}

export const AIPanelInput: React.FC<AIPanelInputProps> = ({ type }) => {
    return (
        <>
            <Stack p="sm" pt="xs" pb="0" gap="xs" w="100%" >
                <Group justify="space-between" align="center" gap={0} px="xs" py="0">
                    <Group gap="xs" justify="center" align="baseline">
                        <Title fz="h2">{type}</Title>
                        <Text c="dimmed" fz="xs">Create a {type} based on your db</Text>
                    </Group>
                    <ActionIcon size="xs" variant="subtle">
                        <X />
                    </ActionIcon>
                </Group>
                <Textarea minRows={3} autosize placeholder="Enter your input here..." />
            </Stack>
        </>
    );
}