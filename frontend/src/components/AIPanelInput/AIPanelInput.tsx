import { ActionIcon, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";

interface AIPanelInputProps {
    type: string;
    initialQuery?: string;
    isActive?: boolean;
    onQueryChange?: (query: string) => void;
}

export const AIPanelInput: React.FC<AIPanelInputProps> = ({ type, initialQuery, isActive = true, onQueryChange }) => {
    const [query, setQuery] = useState(initialQuery || "");
    return (
        <>
            <Stack p="sm" pt="xs" pb="0" gap="xs" w="100%" >
                <Group justify="space-between" align="center" gap={0} px="xs" py="0">
                    <Group gap="xs" justify="center" align="baseline">
                        <Title fz="h2">{type}</Title>
                        <Text c="dimmed" fz="xs">Create a {type} based on your db</Text>
                    </Group>
                    <ActionIcon size="xs" variant="subtle" disabled={isActive}>
                        <ChevronLeft />
                    </ActionIcon>
                </Group>
                <Textarea
                    disabled={!isActive}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onQueryChange?.(e.target.value);
                    }}
                    minRows={3}
                    autosize
                    placeholder="Enter your input here..." />
            </Stack>
        </>
    );
}