import { useRef } from "react";
import { Group, Box, ActionIcon, Tooltip, FileButton } from "@mantine/core";
import { Pencil, Check, Download, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddPanelMenu } from "../AddPanelMenu/AddPanelMenu";
import { EditableTitle } from "../EditableTitle";
import classes from "../Dashboard.module.css";


interface DashboardHeaderProps {
    onAddPanel: (name: string) => void;
    title: string;
    onTitleChange: (newTitle: string) => void;
    isEditMode: boolean;
    onToggleEditMode: () => void;
    onExport?: () => void;
    onImport?: (file: File | null) => void;
}

export const DashboardHeader = ({ onAddPanel, title, onTitleChange, isEditMode, onToggleEditMode, onExport, onImport }: DashboardHeaderProps) => {
    const resetRef = useRef<() => void>(null);

    return (
        <Group px="md" gap={0} wrap="nowrap" justify="space-between">
            <Group gap={3} align="center">

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
                {isEditMode && <AddPanelMenu onAddPanel={onAddPanel} />}
            </Group>
            <Group gap="md">
                <Tooltip label="Export Dashboard">
                    <ActionIcon variant="light" onClick={onExport} size="lg" aria-label="Export Dashboard">
                        <Download size={18} />
                    </ActionIcon>
                </Tooltip>
                
                <FileButton 
                    resetRef={resetRef}
                    onChange={(file) => {
                        if (file) {
                            onImport?.(file);
                            resetRef.current?.();
                        }
                    }} 
                    accept="application/json"
                >
                    {(props) => (
                        <Tooltip label="Import Dashboard">
                            <ActionIcon variant="light" {...props} size="lg" aria-label="Import Dashboard">
                                <Upload size={18} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </FileButton>

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
