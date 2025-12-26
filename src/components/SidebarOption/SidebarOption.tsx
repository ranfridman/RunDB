import { ActionIcon, Group, Text } from "@mantine/core"

interface SidebarOptionProps {
    title: string;
    icon: React.ReactNode;
}

export const SidebarOption: React.FC<SidebarOptionProps> = ({ title, icon }) => {
    return (
        <Group align="center" gap="xs" >
            <ActionIcon size="xs" variant="transparent" >
                {icon}
            </ActionIcon>
            <Text size="xs" >
                {title}
            </Text>
        </Group>
    )
}   