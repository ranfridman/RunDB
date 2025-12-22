import { ActionIcon, Breadcrumbs, Group, Text } from "@mantine/core"
import { PanelLeft } from "lucide-react"



export const Header:React.FC = ()=> {
    return (

        <Group h="100%" mx={15} align="center">


        <Breadcrumbs separator="/" c="dimmed">
        <ActionIcon size={16} variant="transparent" >
        <PanelLeft  />
        </ActionIcon>       
            <Text size="sm" >Database</Text>              
        </Breadcrumbs>
    </Group>
    )
} 