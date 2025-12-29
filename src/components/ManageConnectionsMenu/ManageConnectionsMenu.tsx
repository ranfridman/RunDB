import { ActionIcon, Avatar, Menu, ThemeIcon } from "@mantine/core"
import { Check, EllipsisVertical, Plus } from "lucide-react"
import { IconArrowsLeftRight, IconTrash } from "@tabler/icons-react"
import { useDBConnectionsStore } from "../../stores/useDBConnections"
import { ManageConnectionsMenuOption } from "./ManageConnectionsMenuOption"



export const ManageConnectionsMenu = () => {
    const dbConnections = useDBConnectionsStore((state) => state.dbConnections)

    return (
        <Menu shadow="md" trigger="hover" width={200} closeOnClickOutside closeOnItemClick={false}>
            <Menu.Target >
                <ActionIcon size={20} variant="subtle" >
                    <EllipsisVertical size={16} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Database Picker</Menu.Label>
                {dbConnections.map((dbConnection) => (
                    <ManageConnectionsMenuOption key={dbConnection.id} dbConnectionId={dbConnection.id} dbConnectionName={dbConnection.name} />
                ))}



                <Menu.Item py={3} mb={5} key={"newConnection"} leftSection={
                    <ThemeIcon variant="light" size={20}>
                        <Plus size={16} />
                    </ThemeIcon>
                }>
                    Add Connection
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