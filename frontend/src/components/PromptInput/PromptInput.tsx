import { ActionIcon, Box, Button, Group, Textarea, useMantineTheme, rem } from '@mantine/core';
import { Globe, Plus, Sparkles, CornerDownLeft, X } from 'lucide-react';
import React, { useState } from 'react';

export interface PromptMode {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface PromptInputProps {
    placeholder?: string;
    modes?: PromptMode[];
    onSubmit?: (value: string, modeId: string) => void;
    onValueChange?: (value: string) => void;
    onClose?: () => void;
    initialValue?: string;
    initialModeId?: string;
    submitColor?: string;
}

const DEFAULT_MODES: PromptMode[] = [
    // { id: 'search', label: 'Search', icon: <Globe size={16} strokeWidth={1.5} /> },
    // { id: 'gpt-4o', label: 'GPT-4o', icon: <Sparkles size={16} strokeWidth={1.5} /> },
];

export const PromptInput: React.FC<PromptInputProps> = ({
    placeholder = "What would you like to know?",
    modes = DEFAULT_MODES,
    onSubmit,
    onValueChange,
    onClose,
    initialValue = '',
    initialModeId,
    submitColor = 'blue',
}) => {
    const [value, setValue] = useState(initialValue);
    const [activeModeId, setActiveModeId] = useState(initialModeId || modes[0]?.id || '');
    const theme = useMantineTheme();

    const handleValueChange = (val: string) => {
        setValue(val);
        onValueChange?.(val);
    };

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit?.(value, activeModeId);
        }
    };

    return (
        <Box
            p="md"
            style={{
                border: `1px solid light-dark(${theme.colors.gray[2]}, ${theme.colors.dark[4]})`,
                borderRadius: theme.radius.lg,
                backgroundColor: `light-dark(${theme.white}, ${theme.colors.dark[6]})`,
                boxShadow: theme.shadows.xs,
            }}
        >
            <Textarea
                placeholder={placeholder}
                variant="unstyled"
                autosize
                minRows={1}
                maxRows={10}
                value={value}
                onChange={(event) => handleValueChange(event.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
                styles={{
                    input: {
                        fontSize: rem(16),
                        padding: 0,
                        lineHeight: 1.5,
                        color: `light-dark(${theme.colors.gray[8]}, ${theme.colors.gray[2]})`,
                    },
                }}
            />

            <Group justify="space-between" mt="md" align="center">
                <Group gap="xs">
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="lg"
                        radius="md"
                    >
                        <Plus size={20} strokeWidth={1.5} />
                    </ActionIcon>

                    {modes.map((mode) => (
                        <Button
                            key={mode.id}
                            variant={activeModeId === mode.id ? 'light' : 'subtle'}
                            color={activeModeId === mode.id ? 'blue' : 'gray'}
                            size="xs"
                            leftSection={mode.icon}
                            radius="xl"
                            fw={500}
                            onClick={() => setActiveModeId(mode.id)}
                            styles={{
                                root: {
                                    color: activeModeId === mode.id
                                        ? theme.colors.blue[6]
                                        : `light-dark(${theme.colors.gray[7]}, ${theme.colors.gray[4]})`,
                                },
                            }}
                        >
                            {mode.label}
                        </Button>
                    ))}
                </Group>

                <Group gap="xs">
                    {onClose && (
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            radius="md"
                            onClick={onClose}
                        >
                            <X size={18} />
                        </ActionIcon>
                    )}
                    <ActionIcon
                        variant="filled"
                        color={submitColor}
                        size="lg"
                        radius="md"
                        disabled={!value.trim()}
                        onClick={handleSubmit}
                    >
                        <CornerDownLeft size={18} strokeWidth={2} />
                    </ActionIcon>
                </Group>
            </Group>
        </Box>
    );
};
