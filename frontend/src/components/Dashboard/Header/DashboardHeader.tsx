import { Text, ActionIcon, Group, Popover, SimpleGrid, UnstyledButton, ThemeIcon } from "@mantine/core";
import { Plus, Table2, Columns, LayoutGrid, List, PieChart, LayoutDashboard, AlignLeft, Newspaper, Map, Calendar, FileEdit } from "lucide-react";
import { useState } from "react";

const MENU_ITEMS = [
    { label: 'Table', icon: Table2 },
    { label: 'Chart', icon: PieChart },
];

interface DashboardHeaderProps {
    onAddPanel: (name: string) => void;
}

export const DashboardHeader = ({ onAddPanel }: DashboardHeaderProps) => {
    const [popoverOpened, setPopoverOpened] = useState(false);

    const handleAddPanel = (name: string) => {
        onAddPanel(name);
        setPopoverOpened(false);
    };

    return (
        <Group px="md" mb="xl" gap="sm">
            <Text fw={600} size="lg" c="var(--mantine-color-text)">Analysis by team</Text>
            <Popover opened={popoverOpened} onChange={setPopoverOpened} width={360} position="bottom-start" withArrow shadow="md" radius="lg">
                <Popover.Target>
                    <ActionIcon onClick={() => setPopoverOpened((o) => !o)} variant="light" color="gray" radius="xl" size="sm">
                        <Plus size={16} />
                    </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown p="lg">
                    <Text size="sm" fw={600} mb="xl" c="dimmed">Start from scratch</Text>
                    <SimpleGrid cols={4} spacing="md" verticalSpacing="xl">
                        {MENU_ITEMS.map((item) => (
                            <UnstyledButton
                                key={item.label}
                                onClick={() => handleAddPanel(item.label)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 10,
                                    transition: 'transform 0.1s ease',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <ThemeIcon variant="transparent" c="var(--mantine-color-text)" size="md">
                                    <item.icon size={26} strokeWidth={1.5} />
                                </ThemeIcon>
                                <Text size="11px" fw={500} c="var(--mantine-color-text)">{item.label}</Text>
                            </UnstyledButton>
                        ))}
                    </SimpleGrid>
                </Popover.Dropdown>
            </Popover>
        </Group>
    );
};
