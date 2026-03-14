import React from 'react';
import { ActionIcon, Box, Group, SimpleGrid, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { ChartArea, ChartBar, ChartLine, ChartPie, ChartScatter, Grid3x3, Table as TableIcon, ArrowLeft, X, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import classes from './VisualTypeSelector.module.css';

export type VisualType = 'table' | 'area' | 'bar' | 'line' | 'scatter' | 'pie' | 'heatmap' | 'radar';

interface VisualTypeSelectorProps {
    onSelect: (type: VisualType) => void;
    onClose?: () => void;
    onBack?: () => void;
    selectedType?: VisualType;
}

const types = [
    { id: 'table', label: 'Table', Icon: TableIcon, color: 'blue' },
    { id: 'area', label: 'Area', Icon: ChartArea, color: 'indigo' },
    { id: 'bar', label: 'Bar', Icon: ChartBar, color: 'violet' },
    { id: 'line', label: 'Line', Icon: ChartLine, color: 'teal' },
    { id: 'pie', label: 'Pie', Icon: ChartPie, color: 'pink' },
    { id: 'scatter', label: 'Scatter', Icon: ChartScatter, color: 'grape' },
    { id: 'heatmap', label: 'Heatmap', Icon: Grid3x3, color: 'lime' },
    { id: 'radar', label: 'Radar', Icon: Hexagon, color: 'cyan' },
];

export const VisualTypeSelector: React.FC<VisualTypeSelectorProps> = ({ onSelect, onClose, onBack, selectedType }) => {
    return (
        <Stack gap="md" w="100%"  >
            <Group justify="space-between" align="center" px="xs">
                {onBack ? (
                    <ActionIcon variant="subtle" color="gray" onClick={onBack} size="sm">
                        <ArrowLeft size={16} />
                    </ActionIcon>
                ) : <Box w={24} />}

                <Stack gap={0} align="center">
                    <Text size="xs" fw={800} ta="center" c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Visualization Type
                    </Text>
                    <Text size="11px" c="dimmed" fw={500}>
                        Choose how to display your data
                    </Text>
                </Stack>

                {onClose ? (
                    <ActionIcon variant="subtle" color="gray" onClick={onClose} size="sm">
                        <X size={16} />
                    </ActionIcon>
                ) : <Box w={24} />}
            </Group>

            <SimpleGrid cols={{ base: 4, xs: 4, sm: 5, md: 4, }} spacing="xs" w="100%">
                {types.map((t, index) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -3 }}
                        transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <UnstyledButton
                            p="sm"
                            onClick={() => onSelect(t.id as VisualType)}
                            className={`${classes.card} ${selectedType === t.id ? classes.selected : ''}`}
                            style={{ '--type-color': `var(--mantine-color-${t.color}-5)` } as any}
                            bg={selectedType === t.id 
                                ? `light-dark(var(--mantine-color-${t.color}-0), var(--mantine-color-dark-4))` 
                                : "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-9))"}
                        >
                            <ThemeIcon
                                size={38}
                                radius="md"
                                variant="transparent"
                                color={t.color}
                                className={classes.icon}
                            >
                                <t.Icon size={20} strokeWidth={2.2} />
                            </ThemeIcon>

                            <Text size="xs" fw={700} className={classes.label}>
                                {t.label}
                            </Text>
                        </UnstyledButton>
                    </motion.div>
                ))}
            </SimpleGrid>
        </Stack>
    );
};
