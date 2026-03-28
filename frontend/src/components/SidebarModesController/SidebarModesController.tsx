import { ActionIcon, Badge, Box, Group, Indicator, Stack, Text } from "@mantine/core"
import { History, LibraryBig, Search } from "lucide-react"


export const sidebarModeOptions = [
    { label: "Sources", icon: LibraryBig },
    { label: "Search", icon: Search },
    { label: "History", icon: History },
]


export const SidebarModesController = () => {
    return (
        <Stack align="center" justify="center" gap="xs" w="3em" pt="xs">
            {sidebarModeOptions.map((option, index) => (
                <Group w="100%" key={index} justify="center" align="center">

                    <ActionIcon variant={index === 2 ? "filled" : "subtle"} color={index === 2 ? "var(--mantine-color-default-hover)" : ""} c="dimmed" size="lg" radius="sm">
                        {index === 0 ? <Indicator color="violet.7" offset={3} p={0}
                            radius="sm"
                            label={<Text p={0} fz="9">3</Text>} size={12} position="bottom-end">
                            <option.icon size={18} />
                        </Indicator> : <option.icon size={18} />}
                    </ActionIcon>
                </Group>
            ))}
        </Stack>
    )
}