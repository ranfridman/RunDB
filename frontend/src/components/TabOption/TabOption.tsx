import { ActionIcon, Tabs } from "@mantine/core"
import { typeToColor, typeToIcon } from "../TypesTheme/TypesTheme"
import { Divider } from "@mantine/core"
import { X } from "lucide-react"
import { useHover } from "@mantine/hooks";
import classes from './TabOption.module.css';
import { useTabsStore } from "../../stores/useTabs";

interface TabOptionProps {
    option: any;
    index: number;
}

export const TabOption: React.FC<TabOptionProps> = ({ option, index }) => {
    const { hovered, ref } = useHover();
    const closeTab = useTabsStore((state) => state.removeTab);
    const isActive = useTabsStore((state) => state.activeTab === option.id);
    return (
        <>
            <Tabs.Tab key={index} px="xs" bg={isActive ? "light-dark(var(--mantine-color-white), var(--mantine-color-dark-9))" : ""} color={typeToColor[option.type ?? '']}
                rightSection={
                    <ActionIcon size="xs" ref={ref} variant="transparent" c="dimmed" className={classes.closeIcon}>
                        {(isActive || hovered) && < X onClick={() => closeTab(option.id)} />}
                    </ActionIcon>
                }
                leftSection={typeToIcon[option.type ?? '']} value={option.id} >
                {option.label}
            </Tabs.Tab >
            <Divider orientation="vertical" mx={0} />
        </>
    )
}