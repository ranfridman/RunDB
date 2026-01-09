import { ActionIcon, Button, Menu, Text } from "@mantine/core"
import { IconArrowsLeftRight, IconDotsVertical, IconMessageCircle, IconSearch, IconSettings, IconTrash } from "@tabler/icons-react"
import { typeToIcon } from "../TypesTheme/TypesTheme"



export const DatabaseTreeTableMenu: React.FC = () => {
    return (
        <Menu shadow="md" trigger="hover" width={200} position="right-start">
            <Menu.Target >
                <IconDotsVertical size={16} />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item leftSection={typeToIcon['Table']}>
                    Open Table
                </Menu.Item>
                <Menu.Item leftSection={typeToIcon['SQL']}>
                    Run SQL
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconSearch size={14} />}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            ⌘K
                        </Text>
                    }
                >
                    Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                    leftSection={<IconArrowsLeftRight size={14} />}
                >
                    Transfer my data
                </Menu.Item>
                <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                >
                    Delete my account
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}