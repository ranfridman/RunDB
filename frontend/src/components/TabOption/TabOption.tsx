import { ActionIcon, Tabs, TextInput, Text, Loader } from "@mantine/core"
import { typeToColor, typeToIcon } from "../TypesTheme/TypesTheme"
import { Divider } from "@mantine/core"
import { X } from "lucide-react"
import { useHover } from "@mantine/hooks";
import classes from './TabOption.module.css';
import { useTabsStore } from "../../stores/useTabs";
import { useState } from "react";

interface TabOptionProps {
    option: any;
    index: number;
}

export const TabOption: React.FC<TabOptionProps> = ({ option, index }) => {
    const { hovered, ref } = useHover();
    const closeTab = useTabsStore((state) => state.removeTab);
    const updateTab = useTabsStore((state) => state.updateTab);
    const isActive = useTabsStore((state) => state.activeTab === option.id);

    const [isEditing, setIsEditing] = useState(false);
    const [tempLabel, setTempLabel] = useState(option.label);

    const handleRename = () => {
        if (tempLabel.trim() && tempLabel !== option.label) {
            updateTab(option.id, { label: tempLabel });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleRename();
        if (e.key === 'Escape') {
            setTempLabel(option.label);
            setIsEditing(false);
        }
    };

    return (
        <>
            <Tabs.Tab
                key={index}
                px="xs"
                bg={isActive ? "light-dark(var(--mantine-color-white), var(--mantine-color-dark-9))" : ""}
                color={typeToColor[option.type ?? '']}
                onDoubleClick={() => setIsEditing(true)}
                h={30}
                style={{ borderRadius: 0 }}
                rightSection={
                    <ActionIcon size="xs" ref={ref} variant="transparent" c="dimmed" className={isEditing ? "" : classes.closeIcon}>
                        {((isActive && !option.isLoading) || hovered) ? < X onClick={(e) => { e.stopPropagation(); closeTab(option.id) }} />
                            : <Loader size={14} color={typeToColor[option.type ?? '']} />}
                    </ActionIcon>
                }
                maw="200px"
                leftSection={typeToIcon[option.type ?? '']}
                value={option.id}
            >
                {isEditing ? (
                    <TextInput
                        autoFocus
                        onFocus={(e) => e.currentTarget.select()}
                        variant="default"
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.currentTarget.value)}
                        onBlur={handleRename}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        fz="xs"
                        my="auto"
                        w="fit-content"
                        // maw={200}
                        styles={{
                            input: {
                                height: '1.2em',
                                minHeight: 'unset',
                                padding: '0',
                                maxWidth: '125px',
                                fontSize: 'inherit',
                                fontWeight: 'inherit',
                                border: '1px solid',
                                borderColor: `var(--mantine-color-${typeToColor[option.type ?? '']}-5)`,
                                backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-midnight-8))'
                            }
                        }}
                    />


                ) : (
                    <Text component="div" h="100%" m={0} maw="125px" fz="xs" truncate="end" >
                        {option.label}
                    </Text>
                )}
            </Tabs.Tab >
            <Divider orientation="vertical" mx={0} />
        </>
    )
}