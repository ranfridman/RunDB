import { ActionIcon, Tabs } from "@mantine/core"
import { typeToColor, typeToIcon } from "../TypesTheme/TypesTheme"
import { Divider } from "@mantine/core"
import { X } from "lucide-react"
import { useHover } from "@mantine/hooks";
import classes from './TabOption.module.css';

interface TabOptionProps {
    option: any;
    index: number;
    isActive: boolean;
    onClose: (id: string) => void;
}

export const TabOption: React.FC<TabOptionProps> = ({ option, index, isActive, onClose }) => {
    const { hovered, ref } = useHover();

    return (
        <>
            <Tabs.Tab key={index} px="xs" bg={isActive ? "dark.9" : ""} color={typeToColor[option.type ?? '']}
                rightSection={
                    <ActionIcon size="xs" ref={ref} variant="transparent" c="dimmed" className={classes.closeIcon}>
                        {(isActive || hovered) && < X onClick={() => onClose(option.id)} />}
                    </ActionIcon>
                }
                leftSection={typeToIcon[option.type ?? '']} value={option.id} >
                {option.label}
            </Tabs.Tab >
            <Divider orientation="vertical" mx={0} />
        </>
    )
}