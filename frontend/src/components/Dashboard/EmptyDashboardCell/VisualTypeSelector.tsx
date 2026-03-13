import React from 'react';
import { Group, Paper, Stack, Text, UnstyledButton, useMantineTheme, SimpleGrid, rem, ThemeIcon, Box } from '@mantine/core';
import { Table as TableIcon, ChartArea, ChartBar, ChartLine, ChartPie, ChartScatter, Grid3x3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export type VisualType = 'table' | 'area' | 'bar' | 'line' | 'scatter' | 'pie' | 'heatmap';

interface VisualTypeSelectorProps {
    onSelect: (type: VisualType) => void;
}

const types = [
    { id: 'table', label: 'Table', description: 'Raw data view', Icon: TableIcon, color: 'blue' },
    { id: 'area', label: 'Area Chart', description: 'Trend with volume', Icon: ChartArea, color: 'yellow' },
    { id: 'bar', label: 'Bar Chart', description: 'Categorical compare', Icon: ChartBar, color: 'orange' },
    { id: 'line', label: 'Line Chart', description: 'Simple trends', Icon: ChartLine, color: 'red' },
    { id: 'pie', label: 'Pie Chart', description: 'Part-to-whole', Icon: ChartPie, color: 'teal' },
    { id: 'scatter', label: 'Scatter', description: 'Relationships', Icon: ChartScatter, color: 'grape' },
    { id: 'heatmap', label: 'Heatmap', description: 'Density patterns', Icon: Grid3x3, color: 'green' },
];

export const VisualTypeSelector: React.FC<VisualTypeSelectorProps> = ({ onSelect }) => {
    const theme = useMantineTheme();

    return (
        <Stack gap="xl" w="100%" py="md">
            <Box>
                <Text size="lg" fw={700} ta="center" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                    Visualize Your Data
                </Text>
                <Text size="sm" c="dimmed" ta="center" mt={4}>
                    Choose the best way to represent your query results
                </Text>
            </Box>

            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                {types.map((t, index) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Paper
                            component="button"
                            onClick={() => onSelect(t.id as VisualType)}
                            p="md"
                            radius="lg"
                            withBorder
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: `light-dark(${theme.white}, ${theme.colors.dark[6]})`,
                                position: 'relative',
                                overflow: 'hidden',
                                height: '100%',
                            }}
                            className="visual-type-card"
                        >
                            <ThemeIcon
                                size={44}
                                radius="md"
                                variant="light"
                                color={t.color}
                                mb="sm"
                            >
                                <t.Icon size={24} />
                            </ThemeIcon>
                            
                            <Text size="sm" fw={700} mb={2}>{t.label}</Text>
                            <Text size="xs" c="dimmed" lh={1.2}>{t.description}</Text>
                            
                            <Box className="hover-arrow" style={{ 
                                position: 'absolute', 
                                bottom: rem(8), 
                                right: rem(8),
                                opacity: 0,
                                transform: 'translateX(-5px)',
                                transition: 'all 0.2s ease'
                            }}>
                                <ArrowRight size={14} color={theme.colors[t.color][6]} />
                            </Box>
                        </Paper>
                    </motion.div>
                ))}
            </SimpleGrid>

            <style dangerouslySetInnerHTML={{ __html: `
                .visual-type-card:hover {
                    border-color: ${theme.colors.blue[5]};
                    transform: translateY(-4px);
                    box-shadow: ${theme.shadows.md};
                }
                .visual-type-card:hover .hover-arrow {
                    opacity: 1 !important;
                    transform: translateX(0) !important;
                }
            `}} />
        </Stack>
    );
};
