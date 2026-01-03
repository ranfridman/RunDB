import { ActionIcon, Breadcrumbs, Button, Group, Indicator, Text } from "@mantine/core"
import { BoxSelect, ChevronDown, EllipsisVertical, Filter, ListChevronsUpDown, PanelLeft } from "lucide-react"
import { ManageConnectionsMenu } from "../ManageConnectionsMenu/ManageConnectionsMenu"
import { useDBConnectionsStore } from "@/stores/useDBConnections"



export const Header: React.FC = () => {
    const activeDB = useDBConnectionsStore((state) => state.activeDB);
    const dbConnections = useDBConnectionsStore((state) => state.dbConnections);
    return (
        <Group align="center" h="100%" justify="space-between" px="sm">

            <Group h="100%" align="center">


                <Breadcrumbs separator="/" c="dimmed">
                    <ActionIcon size={16} variant="transparent" >
                        <PanelLeft />
                    </ActionIcon>
                    <Text size="sm" >Database</Text>
                    <Text size="sm" >{dbConnections.find((dbConnection) => dbConnection.id === activeDB)?.name}</Text>
                </Breadcrumbs>
            </Group>
            <ManageConnectionsMenu />
        </Group>
    )
} 