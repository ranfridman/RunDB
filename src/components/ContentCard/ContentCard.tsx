import { ActionIcon, Box, Button, Card, Group, Overlay, Skeleton, Text, Title } from "@mantine/core";
import { Copy, Loader } from "lucide-react";
import styles from './ContentCard.module.css';
import mermaid from "mermaid";
import { getIconByType, typeToIcon } from "../TypesTheme/TypesTheme";

interface ContentCardProps {
    children: React.ReactNode;
    isStreaming: boolean;
    type?: string;
    icon?: React.ReactNode;
    padding?: string | number;

}


export const ContentCard = ({ children, isStreaming, type, icon, padding = "md" }: ContentCardProps) => {
    return (
        <Box p="md">
            <Card withBorder p="md" radius="md" >
                <Card.Section variant="" p="xs" pt="xs" withBorder>
                    <Group justify="space-between" align="center"  >
                        <Group gap="xs" align="center">
                            {icon ?? getIconByType(type ?? '', 22)}
                            <Text fz="md">{type}</Text>
                        </Group>
                        <Group gap="xs">
                            <Text fz="xs" c="dimmed">{isStreaming ? "Loading" : "Copy"}</Text>

                            <ActionIcon size="xs" c="dimmed" variant="transparent" >
                                {
                                    isStreaming ? (
                                        <Loader size={16} />
                                    ) : (
                                        <Copy size={16} />
                                    )
                                }
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card.Section>
                <Card.Section p={padding} withBorder bg="gray.9">
                    {
                        isStreaming ? (
                            <Text> Loading </Text>
                        ) : (
                            children
                        )
                    }
                </Card.Section>
                {/* <Card.Section p="xs" withBorder>
                    <Text fz="xs">{type}</Text>
                </Card.Section> */}
            </Card>
        </Box >
    );
};          