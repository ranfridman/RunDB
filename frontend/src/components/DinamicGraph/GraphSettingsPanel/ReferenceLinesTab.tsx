import { ActionIcon, Box, CheckIcon, ColorSwatch, Group, Menu, NumberInput, ScrollArea, SimpleGrid, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState, useEffect, useCallback } from 'react';
import { PRESET_COLORS, ReferenceLine, TabProps } from './types';
import classes from './ReferenceLinesTab.module.css';

const ReferenceLineItem = memo(({
    line,
    onUpdate,
    onRemove
}: {
    line: ReferenceLine;
    onUpdate: (id: string, updates: Partial<ReferenceLine>) => void;
    onRemove: (id: string) => void;
}) => {
    const [localLabel, setLocalLabel] = useState(line.label || '');
    const [localY, setLocalY] = useState<number | string>(line.y);

    // Live update for value with small debounce
    useEffect(() => {
        const val = typeof localY === 'number' ? localY : parseFloat(localY as string);
        if (!isNaN(val as number) && val !== line.y) {
            const timeout = setTimeout(() => {
                onUpdate(line.id, { y: val as number });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [localY, line.id, onUpdate, line.y]);

    // Live update for label with small debounce
    useEffect(() => {
        if (localLabel !== line.label) {
            const timeout = setTimeout(() => {
                onUpdate(line.id, { label: localLabel });
            }, 150);
            return () => clearTimeout(timeout);
        }
    }, [localLabel, line.id, onUpdate, line.label]);

    // Sync with external changes (e.g. from steppers or add line)
    useEffect(() => {
        setLocalLabel(line.label || '');
    }, [line.label]);

    useEffect(() => {
        setLocalY(line.y);
    }, [line.y]);

    const handleValueBlur = () => {
        const val = typeof localY === 'number' ? localY : parseFloat(localY as string) || 0;
        if (val !== line.y) {
            onUpdate(line.id, { y: val });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 110 }}
            transition={{ duration: 0.2 }}
        >
            <Group mb="5" gap={8} align="center" wrap="nowrap" className={classes.row}>
                <Menu shadow="md" width={180} position="right-start" offset={15} withinPortal={true} closeOnItemClick={true}>
                    <Menu.Target>
                        <Box
                            className={classes.colorSwatch}
                            style={{ background: line.color }}
                        />
                    </Menu.Target>
                    <Menu.Dropdown p="sm">
                        <Text size="xs" fw={600} c="dimmed" mb={8} style={{ letterSpacing: '0.05em' }}>Color Picker</Text>
                        <SimpleGrid cols={5} spacing={5}>
                            {PRESET_COLORS.map(pc => (
                                <ColorSwatch
                                    key={pc}
                                    color={pc}
                                    size={22}
                                    style={{ cursor: 'pointer', borderRadius: 4 }}
                                    onClick={() => onUpdate(line.id, { color: pc })}
                                >
                                    {line.color === pc && <CheckIcon width={10} />}
                                </ColorSwatch>
                            ))}
                        </SimpleGrid>
                    </Menu.Dropdown>
                </Menu>

                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                    <TextInput
                        size="xs"
                        variant="unstyled"
                        value={localLabel}
                        onChange={(e) => setLocalLabel(e.currentTarget.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Label (optional)"
                        classNames={{ input: classes.labelInput }}
                    />
                    <NumberInput
                        size="xs"
                        variant="unstyled"
                        hideControls
                        value={localY}
                        onChange={(val) => setLocalY(val)}
                        onBlur={handleValueBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Value"
                        classNames={{ input: classes.valueInput }}
                    />
                </Stack>

                <Group gap={2} wrap="nowrap">
                    <Stack gap={0}>
                        <ActionIcon
                            size={14}
                            variant="subtle"
                            color="gray"
                            onClick={() => onUpdate(line.id, { y: (Number(line.y) || 0) + 1 })}
                            className={classes.stepperButton}
                        >
                            <ChevronUp size={10} />
                        </ActionIcon>
                        <ActionIcon
                            size={14}
                            variant="subtle"
                            color="gray"
                            onClick={() => onUpdate(line.id, { y: (Number(line.y) || 0) - 1 })}
                            className={classes.stepperButton}
                        >
                            <ChevronDown size={10} />
                        </ActionIcon>
                    </Stack>

                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        onClick={() => onRemove(line.id)}
                        radius="md"
                        ml={4}
                    >
                        <Trash2 size={13} strokeWidth={2.5} />
                    </ActionIcon>
                </Group>
            </Group>
        </motion.div>
    );
});

export const ReferenceLinesTab = ({ config, setConfig }: TabProps) => {
    const lines = config.referenceLines || [];

    const addLine = useCallback(() => {
        const newLine: ReferenceLine = {
            id: crypto.randomUUID(),
            y: 0,
            color: PRESET_COLORS[0],
            label: ''
        };
        setConfig(p => ({
            ...p,
            referenceLines: [...(p.referenceLines || []), newLine],
        }));
    }, [setConfig]);

    const removeLine = useCallback((id: string) => {
        setConfig(p => ({
            ...p,
            referenceLines: (p.referenceLines || []).filter(l => l.id !== id),
        }));
    }, [setConfig]);

    const updateLine = useCallback((id: string, updates: Partial<ReferenceLine>) => {
        setConfig(p => ({
            ...p,
            referenceLines: (p.referenceLines || []).map(l => l.id === id ? { ...l, ...updates } : l),
        }));
    }, [setConfig]);

    return (
        <Stack gap={4} p="xs" className={classes.container}>
            <ScrollArea.Autosize scrollbars="y" mah={250} offsetScrollbars scrollbarSize={4} type="always">
                <AnimatePresence mode="popLayout" initial={false}>
                    {lines.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Text size="xs" c="dimmed" ta="center" py="sm">No reference lines added yet</Text>
                        </motion.div>
                    ) : (
                        lines.map((line) => (
                            <ReferenceLineItem
                                key={line.id}
                                line={line}
                                onUpdate={updateLine}
                                onRemove={removeLine}
                            />
                        ))
                    )}
                </AnimatePresence>
            </ScrollArea.Autosize>
            <UnstyledButton
                component={motion.button}
                whileTap={{ scale: 0.98 }}
                onClick={addLine}
                className={classes.addButton}
            >
                <Plus size={14} strokeWidth={3} color="var(--mantine-color-blue-filled)" />
                <Text size="xs" color="var(--mantine-color-blue-filled)" fw={600}>Add reference line</Text>
            </UnstyledButton>
        </Stack>
    );
};
