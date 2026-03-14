import { ActionIcon, Box, Button, Group, rem, Stack, Text, Textarea, useMantineTheme, ThemeIcon, Paper, Badge } from '@mantine/core';
import { motion } from 'framer-motion';
import { CodeXml, Sparkles, X, Terminal, Table as TableIcon } from 'lucide-react';
import React, { useState } from 'react';
import { PromptInput } from '../../PromptInput/PromptInput';
import { typeToColor } from '../../TypesTheme/TypesTheme';
import { VisualTypeSelector, VisualType } from './VisualTypeSelector';

interface DashboardCellEditorProps {
    view: 'ai' | 'sql' | 'visual';
    onClose: () => void;
    onSubmit: (name: string, type: 'graph' | 'table', data?: any[], chartType?: string) => void;
    sqlValue: string;
    onSqlValueChange: (val: string) => void;
    visualValue: string;
    onVisualValueChange: (val: string) => void;
    currentChartType?: string;
}

export const DashboardCellEditor: React.FC<DashboardCellEditorProps> = ({
    view,
    onClose,
    onSubmit,
    sqlValue,
    onSqlValueChange,
    visualValue,
    onVisualValueChange,
    currentChartType
}) => {
    const theme = useMantineTheme();
    const [step, setStep] = useState<'input' | 'pick-type'>('input');
    const [pendingData, setPendingData] = useState<{ name: string, data?: any[] } | null>(null);

    const handleInputSubmit = (name: string, data?: any[]) => {
        setPendingData({ name, data });
        setStep('pick-type');
    };

    const config = {
        ai: {
            icon: <Sparkles size={18} color={theme.colors.violet[5]} />,
            title: 'AI Insights',
            gradient: { from: 'indigo' as const, to: 'violet' as const },
            submitColor: 'violet',
        },
        sql: {
            icon: <CodeXml size={18} color={theme.colors.teal[5]} />,
            title: 'SQL Editor',
            gradient: { from: 'teal.6' as const, to: 'teal.4' as const },
            submitColor: 'teal',
        },
        visual: {
            icon: <TableIcon size={18} color={theme.colors[typeToColor.Table][5]} />,
            title: 'Visual Builder',
            gradient: { from: 'blue.6' as const, to: 'blue.4' as const },
            submitColor: 'blue',
        }
    };

    const current = config[view];

    return (
        <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', maxWidth: 700 }}
        >
            <Stack gap="md" w="100%" h="100%">
                {step === 'input' && (
                    <Box pos="relative" mb="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Group gap="xs">
                            {current.icon}
                            <Text fw={600} size="sm" variant="gradient" gradient={current.gradient}>
                                {current.title}
                            </Text>
                        </Group>
                        <ActionIcon variant="subtle" color="gray" onClick={onClose} pos="absolute" right={0}>
                            <X size={18} />
                        </ActionIcon>
                    </Box>
                )}

                <Box w="100%">
                    {step === 'pick-type' ? (
                        <VisualTypeSelector
                            onClose={onClose}
                            onBack={() => setStep('input')}
                            selectedType={currentChartType as any}
                            onSelect={(type) => {
                                const panelType = type === 'table' ? 'table' : 'graph';
                                onSubmit(
                                    pendingData?.name || 'New View',
                                    panelType,
                                    pendingData?.data,
                                    type === 'table' ? undefined : type
                                );
                            }}
                        />
                    ) : view === 'ai' ? (
                        <PromptInput
                            placeholder="Describe the visualization you want to generate..."
                            onSubmit={(value) => {
                                handleInputSubmit(value.length > 30 ? value.substring(0, 30) + '...' : value);
                            }}
                            onClose={onClose}
                            submitColor={typeToColor.Analysis}
                        />
                    ) : view === 'sql' ? (
                        <Stack gap="md" w="100%">
                            <Box
                                p="sm"
                                style={{
                                    border: `1px solid light-dark(${theme.colors.gray[2]}, ${theme.colors.dark[4]})`,
                                    borderRadius: theme.radius.lg,
                                    backgroundColor: `light-dark(${theme.white}, ${theme.colors.dark[8]})`,
                                    position: 'relative',
                                    minHeight: rem(120),
                                    display: 'flex',


                                    flexDirection: 'column'
                                }}
                            >
                                <Textarea
                                    value={sqlValue}
                                    onChange={(e) => onSqlValueChange(e.currentTarget.value)}
                                    placeholder="SELECT * FROM tables LIMIT 10;"
                                    minRows={4}
                                    maxRows={10}
                                    autosize
                                    variant="unstyled"
                                    styles={{
                                        input: {
                                            fontFamily: 'var(--mantine-font-family-mono)',
                                            fontSize: rem(13),
                                            lineHeight: 1.6,
                                            paddingBottom: rem(40),
                                        }
                                    }}
                                />
                                <Group justify="flex-end" style={{ position: 'absolute', bottom: rem(12), right: rem(12) }}>
                                    <Button
                                        size="xs"
                                        radius="md"
                                        color={typeToColor.SQL}
                                        c="var(--mantine-color-body)"
                                        onClick={() => handleInputSubmit('SQL Query')}
                                    >
                                        Run Query
                                    </Button>
                                </Group>
                            </Box>
                        </Stack>
                    ) : (
                        <Stack gap="md" w="100%">
                            <Box
                                p="sm"
                                style={{
                                    border: `1px solid light-dark(${theme.colors.gray[2]}, ${theme.colors.dark[4]})`,
                                    borderRadius: theme.radius.lg,
                                    backgroundColor: `light-dark(${theme.white}, ${theme.colors.dark[8]})`,
                                    position: 'relative',
                                    minHeight: rem(120),
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Textarea
                                    value={visualValue}
                                    onChange={(e) => onVisualValueChange(e.currentTarget.value)}
                                    placeholder='[{ "id": 1, "name": "Item 1" }, ...]'
                                    minRows={4}
                                    maxRows={4}
                                    autosize
                                    variant="unstyled"
                                    styles={{
                                        input: {
                                            fontFamily: 'var(--mantine-font-family-mono)',
                                            fontSize: rem(13),
                                            lineHeight: 1.6,
                                            paddingBottom: rem(40),
                                        }
                                    }}
                                />
                                <Group justify="flex-end" style={{ position: 'absolute', bottom: rem(12), right: rem(12) }}>
                                    <Button
                                        size="xs"
                                        radius="md"
                                        color="blue"
                                        c="white"
                                        onClick={() => {
                                            try {
                                                const parsed = JSON.parse(visualValue);
                                                // Support both array of objects and a single object
                                                const dataArray = Array.isArray(parsed) ? parsed : [parsed];
                                                handleInputSubmit('Visual Chart', dataArray);
                                            } catch (e) {
                                                console.error('JSON parsing failed', e);
                                                handleInputSubmit('Visual Chart', []);
                                            }
                                        }}
                                    >
                                        Build Visual
                                    </Button>
                                </Group>
                            </Box>
                        </Stack>
                    )}
                </Box>
            </Stack>
        </motion.div>
    );
};
