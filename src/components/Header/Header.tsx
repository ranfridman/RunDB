import { ActionIcon, Breadcrumbs, Button, Group, Indicator, Text } from "@mantine/core"
import { BoxSelect, ChevronDown, EllipsisVertical, Filter, ListChevronsUpDown, PanelLeft } from "lucide-react"
import { ManageConnectionsMenu } from "../ManageConnectionsMenu/ManageConnectionsMenu"



export const Header: React.FC = () => {
    return (
        <Group align="center" h="100%" justify="space-between" px="sm">

            <Group h="100%" align="center">


                <Breadcrumbs separator="/" c="dimmed">
                    <ActionIcon size={16} variant="transparent" >
                        <PanelLeft />
                    </ActionIcon>
                    <Text size="sm" >Database</Text>
                </Breadcrumbs>
            </Group>
            <ManageConnectionsMenu />
        </Group>
    )
} 