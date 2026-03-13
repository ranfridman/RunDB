import { ActionIcon, Badge, Box, Button, Center, Group, Paper, rem, Stack, Text, ThemeIcon, useMantineTheme } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CodeXml, Sparkles, Table as TableIcon } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { typeToColor } from '../../TypesTheme/TypesTheme';
import { DashboardCellEditor } from './DashboardCellEditor';
import { Panel, PanelActionsContext } from '../Board/types';

interface EmptyDashboardCellProps {
    panel: Panel;
}

export const EmptyDashboardCell: React.FC<EmptyDashboardCellProps> = ({ panel }) => {
    const theme = useMantineTheme();
    const actions = useContext(PanelActionsContext);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [view, setView] = useState<'options' | 'ai' | 'sql' | 'visual'>('options');
    const [sqlValue, setSqlValue] = useState('SELECT * FROM tables LIMIT 10;');
    const [visualValue, setVisualValue] = useState('[\n  { "name": "A", "value": 10 }\n]');

    const handleAdd = (type: 'table' | 'graph', method: 'Visual' | 'SQL' | 'AI') => {
        if (method === 'AI') {
            setView('ai');
            return;
        }
        if (method === 'SQL') {
            setView('sql');
            return;
        }
        if (method === 'Visual') {
            setView('visual');
            return;
        }

        actions?.updatePanel(panel.id, {
            type,
            name: `${method} ${type === 'table' ? 'Table' : 'Chart'}`
        });
    };

    const options = [
        {
            label: 'Visual Builder',
            description: 'Drag & drop interface to explore tables and relations.',
            type: 'table' as const,
            method: 'Visual' as const,
            color: typeToColor.Table,
            tag: 'Standard',
            icon: <TableIcon size={22} />,
        },
        {
            label: 'SQL Editor',
            description: 'Write custom queries for complex data aggregation.',
            type: 'table' as const,
            method: 'SQL' as const,
            color: typeToColor.SQL,
            tag: 'Advanced',
            icon: <CodeXml size={22} />,
        },
        {
            label: 'AI Insights',
            description: 'Generate visualizations using natural language prompts.',
            type: 'graph' as const,
            method: 'AI' as const,
            color: typeToColor.Analysis,
            tag: 'Smart',
            icon: <Sparkles size={22} />,
            isPremium: true,
        },
    ];

    return (
        <Center
            h="100%"
            w="100%"
            p="md"
            style={{
                backgroundColor: `light-dark(${theme.colors.gray[0]}, ${theme.colors.dark[8]})`,
                borderRadius: theme.radius.lg,
                border: `1px solid light-dark(${theme.colors.gray[2]}, ${theme.colors.dark[5]})`,
                overflow: 'auto', // Enable scrolling if too small
            }}
        >
            <Stack align="center" w="100%" mah="100%">
                <AnimatePresence mode="wait">
                    {view === 'options' ? (
                        <motion.div
                            key="options"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <Stack align="center" w="100%">
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Stack gap={4} align="center">
                                        <Text size="xs" c="dimmed" fw={500} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Initialize Your View
                                        </Text>
                                    </Stack>
                                </motion.div>

                                <Group gap="sm" justify="center" align="stretch" wrap="nowrap" w="100%" style={{ maxWidth: 850 }}>
                                    {options.map((opt, index) => (
                                        <motion.div
                                            key={opt.label}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ y: -5 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20,
                                                delay: index * 0.05
                                            }}
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                display: 'flex'
                                            }}
                                        >
                                            <Paper
                                                component="button"
                                                onClick={() => handleAdd(opt.type, opt.method)}
                                                onMouseEnter={() => setHoveredIndex(index)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                p="md"
                                                radius="lg"
                                                withBorder
                                                style={{
                                                    flex: 1,
                                                    width: '100%',
                                                    height: rem(140),
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    paddingBottom: rem(24),
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    backgroundColor: hoveredIndex === index
                                                        ? `light-dark(${theme.white}, ${theme.colors.dark[6]})`
                                                        : `light-dark(${theme.colors.gray[0]}, ${theme.colors.dark[7]})`,
                                                    borderColor: hoveredIndex === index
                                                        ? (opt.isPremium ? theme.colors.violet[5] : theme.colors[opt.color][5])
                                                        : `light-dark(${theme.colors.gray[3]}, ${theme.colors.dark[4]})`,
                                                    boxShadow: hoveredIndex === index ? theme.shadows.xl : theme.shadows.sm,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
                                                }}
                                            >
                                                {/* Background Glow */}
                                                <AnimatePresence>
                                                    {hoveredIndex === index && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 0.05 }}
                                                            exit={{ opacity: 0 }}
                                                            style={{
                                                                position: 'absolute',
                                                                inset: 0,
                                                                background: opt.isPremium
                                                                    ? `linear-gradient(135deg, ${theme.colors.indigo[6]}, ${theme.colors.violet[6]})`
                                                                    : theme.colors[opt.color][6],
                                                                pointerEvents: 'none',
                                                            }}
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                <Group justify="space-between" align="start" mb="xs" wrap="nowrap">
                                                    <ThemeIcon
                                                        size={36}
                                                        radius="md"
                                                        variant="light"
                                                        color={opt.isPremium ? 'violet' : opt.color}
                                                        style={{ flexShrink: 0 }}
                                                    >
                                                        {opt.icon}
                                                    </ThemeIcon>
                                                    <Badge
                                                        variant="dot"
                                                        color={opt.isPremium ? 'violet' : opt.color}
                                                        size="xs"
                                                        style={{ textTransform: 'none', flexShrink: 0 }}
                                                    >
                                                        {opt.tag}
                                                    </Badge>
                                                </Group>

                                                <Stack gap={2} flex={1} style={{ minWidth: 0 }}>
                                                    <Text
                                                        fw={700}
                                                        size="sm"
                                                        variant={opt.isPremium ? 'gradient' : 'text'}
                                                        gradient={{ from: 'indigo', to: 'violet' }}
                                                        truncate="end"
                                                    >
                                                        {opt.label}
                                                    </Text>
                                                    <Text size="xs" c="dimmed" lh={1.3} lineClamp={2}>
                                                        {opt.description}
                                                    </Text>
                                                </Stack>

                                                <Box mt="auto">
                                                    <Group justify="flex-end" h={rem(16)}>
                                                        <AnimatePresence>
                                                            {hoveredIndex === index && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, x: -10 }}
                                                                >
                                                                    <ArrowRight
                                                                        size={14}
                                                                        color={opt.isPremium ? theme.colors.violet[5] : theme.colors[opt.color][5]}
                                                                    />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </Group>
                                                </Box>
                                            </Paper>
                                        </motion.div>
                                    ))}
                                </Group>
                            </Stack>
                        </motion.div>
                    ) : (
                        <DashboardCellEditor
                            view={view as 'ai' | 'sql' | 'visual'}
                            onClose={() => setView('options')}
                            sqlValue={sqlValue}
                            onSqlValueChange={setSqlValue}
                            visualValue={visualValue}
                            onVisualValueChange={setVisualValue}
                            onSubmit={(name, type, data, chartType) => {
                                actions?.updatePanel(panel.id, {
                                    type,
                                    name,
                                    data,
                                    chartType
                                });
                            }}
                        />
                    )}
                </AnimatePresence>
            </Stack>
        </Center>
    );
};
