import { useDBConnectionsStore } from "../../stores/useDBConnections"
import { Avatar, Menu, ThemeIcon } from "@mantine/core"
import { Check, Pencil, Trash } from "lucide-react"
import { AddDatabaseModal } from "../AddDatabaseModal/AddDatabaseModal"
import { useState } from "react"


interface ManageConnectionsMenuOptionProps {
    dbConnectionId: string,
    dbConnectionName: string,
}

export const ManageConnectionsMenuOption: React.FC<ManageConnectionsMenuOptionProps> = ({ dbConnectionId, dbConnectionName }) => {
    const activeDB = useDBConnectionsStore((state) => state.activeDB)
    const setActiveDB = useDBConnectionsStore((state) => state.setActiveDB)
    const setDBModal = useDBConnectionsStore((state) => state.setDBModal)
    return (
        <Menu.Sub openDelay={120} closeDelay={150} offset={10} position="left-start">
            <Menu.Sub.Target>
                <Menu.Sub.Item py={3} mb={5} key={dbConnectionId} bg={activeDB === dbConnectionId ? "dark" : ""}
                    onClick={() => setActiveDB(dbConnectionId)}
                    leftSection={
                        <Avatar size={20} variant="light" name={dbConnectionName} color="initials" radius="sm" />}
                    rightSection={
                        activeDB === dbConnectionId ?
                            <ThemeIcon variant="subtle" size={20}>
                                <Check size={14} />
                            </ThemeIcon> : <></>
                    }
                >
                    {dbConnectionName}
                </Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown color="dark" >
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item c="" py={3} mb={5} onClick={() => setActiveDB(dbConnectionId)} disabled={activeDB === dbConnectionId} leftSection={<Check size={14} />}>Select Database</Menu.Item>
                <Menu.Item c="" py={3} mb={5} onClick={() => setDBModal(dbConnectionId)} leftSection={<Pencil size={14} />}>Edit Properties</Menu.Item>
                <Menu.Item color="red" py={3} mb={5} leftSection={<Trash size={14} />}>Remove Connection</Menu.Item>
            </Menu.Sub.Dropdown>
        </Menu.Sub>
    )
}