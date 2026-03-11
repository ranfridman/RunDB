import { Text, ActionIcon, Group, Popover, SimpleGrid, UnstyledButton, ThemeIcon, Box } from "@mantine/core";
import { Plus, Table2, PieChart, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditableTitle } from "../EditableTitle";
import classes from "../Dashboard.module.css";

const MENU_ITEMS = [
    { label: 'Table', icon: Table2 },
    { label: 'Chart', icon: PieChart },
];

interface DashboardHeaderProps {
    onAddPanel: (name: string) => void;
    title: string;
    onTitleChange: (newTitle: string) => void;
    isEditMode: boolean;
    onToggleEditMode: () => void;
}

export const DashboardHeader = ({ onAddPanel, title, onTitleChange, isEditMode, onToggleEditMode }: DashboardHeaderProps) => {
    const [popoverOpened, setPopoverOpened] = useState(false);

    const handleAddPanel = (name: string) => {
        onAddPanel(name);
        setPopoverOpened(false);
    };

    return (
        <Group px="md" gap={0} wrap="nowrap" justify="space-between">
            <Group gap={3}>

                <EditableTitle
                    value={title}
                    onSave={onTitleChange}
                    fontSize="lg"
                    fontWeight={600}
                    textTransform="none"
                    color="var(--mantine-color-text)"
                    className={classes.dashboardTitle}
                    disabled={!isEditMode}
                    style={{ flex: 1, minWidth: 0 }}
                />
                {isEditMode && (
                    <Popover opened={popoverOpened} onChange={setPopoverOpened} width={360} position="bottom-end" shadow="md" radius="sm">
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
                )}
            </Group>
            <Group gap="md">
                <Box
                    component={motion.div}
                    layout
                    onClick={onToggleEditMode}
                    className={classes.editToggle}
                    animate={{
                        backgroundColor: isEditMode
                            ? 'light-dark(var(--mantine-color-yellow-light), rgba(255, 212, 59, 0.15))'
                            : 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
                        color: isEditMode
                            ? 'light-dark(var(--mantine-color-yellow-9), var(--mantine-color-yellow-5))'
                            : 'var(--mantine-color-dimmed)',
                        borderColor: isEditMode
                            ? 'light-dark(var(--mantine-color-yellow-filled), var(--mantine-color-yellow-8))'
                            : 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
                    }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.div
                        layout
                        initial={false}
                        animate={{ rotate: isEditMode ? 0 : 0 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isEditMode ? 'edit' : 'view'}
                                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex' }}
                            >
                                {isEditMode ? <Check size={14} /> : <Pencil size={14} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                    <motion.span layout style={{ whiteSpace: 'nowrap' }}>
                        {isEditMode ? 'Finish Editing' : 'Edit Dashboard'}
                    </motion.span>
                </Box>

            </Group>
        </Group>
    );
};
