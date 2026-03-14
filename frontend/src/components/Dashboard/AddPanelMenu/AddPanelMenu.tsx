import { Text, ActionIcon, Popover, SimpleGrid, UnstyledButton, ThemeIcon } from "@mantine/core";
import { Plus, Table2, Sparkles, CodeXml } from "lucide-react";
import { useState } from "react";

import classes from './AddPanelMenu.module.css';

const MENU_ITEMS = [
    { label: 'AI', icon: Sparkles, color: 'violet' },
    { label: 'SQL', icon: CodeXml, color: 'teal' },
    { label: 'Empty', icon: Plus, color: 'gray' },
];

interface AddPanelMenuProps {
    onAddPanel: (name: string) => void;
}

export const AddPanelMenu = ({ onAddPanel }: AddPanelMenuProps) => {
    const [opened, setOpened] = useState(false);

    const handleAddPanel = (name: string) => {
        onAddPanel(name);
        setOpened(false);
    };

    return (
        <Popover opened={opened} onChange={setOpened} width={360} position="bottom-start" shadow="md" radius="sm">
            <Popover.Target>
                <ActionIcon onClick={() => setOpened((o) => !o)} variant="light" color="gray" radius="xl" size="sm">
                    <Plus size={16} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p="lg">
                <Text size="sm" fw={600} mb="md" c="dimmed">Start from scratch</Text>
                <SimpleGrid cols={4} spacing="md" verticalSpacing="xl">
                    {MENU_ITEMS.map((item) => (
                        <UnstyledButton
                            key={item.label}
                            onClick={() => handleAddPanel(item.label)}
                            className={classes.menuButton}
                        >
                            <ThemeIcon variant="transparent" c={item.color} size="md">
                                <item.icon size={26} strokeWidth={1.5} />
                            </ThemeIcon>
                            <Text size="11px" fw={500} c="var(--mantine-color-text)">{item.label}</Text>
                        </UnstyledButton>
                    ))}
                </SimpleGrid>
            </Popover.Dropdown>
        </Popover>
    );
};
