import { Box, Group, Switch, Text, Menu, UnstyledButton, ActionIcon, Tooltip } from '@mantine/core';
import { ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';

/** Pill-button segmented control */
export const PillGroup = ({ value, onChange, options }: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) => (
    <Group gap={3} style={{
        background: 'light-dark(rgba(0,0,0,0.04), rgba(255,255,255,0.04))',
        borderRadius: 8,
        padding: 3,
        border: '1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.06))',
    }}>
        {options.map(opt => {
            const active = value === opt;
            return (
                <Box
                    key={opt}
                    onClick={() => onChange(opt)}
                    style={{
                        flex: 1, textAlign: 'center',
                        padding: '3px 0',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: active ? 700 : 400,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.15s',
                        color: active ? 'light-dark(#000, #fff)' : 'light-dark(rgba(0,0,0,0.45), rgba(255,255,255,0.35))',
                        background: active ? 'light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.14))' : 'transparent',
                        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                        letterSpacing: active ? '0.01em' : '0',
                    }}
                >
                    {opt}
                </Box>
            );
        })}
    </Group>
);

/** Label + switch toggle row */
export const ToggleRow = ({ icon: Icon, label, checked, onChange }: {
    icon?: any;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <Group justify="space-between" align="center" wrap="nowrap" style={{ padding: '6px 8px' }}>
        <Group gap={8} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {Icon && <Icon size={14} style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />}
            <Text size="xs"
                c={checked ? undefined : 'light-dark(var(--mantine-color-gray-8), var(--mantine-color-midnight-4))'}
                fw={checked ? 500 : 400}
                truncate="end"
                style={{ transition: 'color 0.15s' }}>
                {label}
            </Text>
        </Group>
        <Switch
            size="xs"
            checked={checked}
            onChange={e => onChange(e.currentTarget.checked)}
            styles={{
                track: { cursor: 'pointer' },
            }}
        />
    </Group>
);

/** Menu row for selecting options */
export const MenuRow = ({ icon: Icon, label, value, options, onSelect, opened, onOpenChange }: any) => {
    const [hover, setHover] = useState(false);

    const opts = options?.map((o: any) => typeof o === 'string' ? { label: o, value: o } : o) || [];

    const content = (
        <UnstyledButton
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 4,
                background: hover ? 'light-dark(rgba(0,0,0,0.03), rgba(255,255,255,0.05))' : 'transparent',
                transition: 'background 0.1s'
            }}
        >
            <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap={8} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    {Icon && <Icon size={14} style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />}
                    <Text size="xs" fw={400} truncate="end" style={{ color: 'light-dark(var(--mantine-color-gray-8), var(--mantine-color-dark-0))' }}>{label}</Text>
                </Group>
                <Group gap={4} wrap="nowrap" style={{ flexShrink: 0, minWidth: 0, maxWidth: '50%' }}>
                    {value && <Text size="xs" c="dimmed" truncate="end">{opts.find((o: any) => o.value === value)?.label || value}</Text>}
                    {options && options.length > 0 && <ChevronRight size={14} style={{ color: 'var(--mantine-color-gray-4)', flexShrink: 0 }} />}
                </Group>
            </Group>
        </UnstyledButton>
    );

    if (opts.length > 0) {
        return (
            <Menu
                position="right-start"
                offset={7}
                shadow="md"
                withinPortal={true}
                closeOnItemClick={false}
                opened={opened}
                onChange={onOpenChange}
            >
                <Menu.Target>
                    {content}
                </Menu.Target>
                <Menu.Dropdown>
                    {opts.map((opt: any) => (
                        <Menu.Item
                            key={opt.value}
                            onClick={() => onSelect?.(opt.value)}
                            leftSection={value === opt.value ? <Check size={14} /> : <Box w={14} h={14} />}
                        >
                            {opt.label}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        );
    }
    return content;
};

/** Row with label and pill-button segmented control */
export const SegmentedRow = ({ icon: Icon, label, value, onChange, options }: {
    icon?: any;
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) => (
    <Group justify='space-between' py="3">
        <Group gap={8} mb="xs" wrap="nowrap">
            {Icon && <Icon size={14} style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />}
            <Text size="xs" fw={500} c="dimmed" truncate="end">
                {label}
            </Text>
        </Group>
        <PillGroup value={value} onChange={onChange} options={options} />
    </Group>
);
/** Compact Button Group on the right */
export const CompactSegmentRow = ({ icon: Icon, label, value, options, onChange }: {
    icon?: any;
    label: string;
    value: string;
    options: { value: string; icon: any; label: string }[];
    onChange: (v: string) => void;
}) => (
    <Group justify="space-between" align="center" wrap="nowrap" h={32} px={8} py={4}>
        <Group gap={8} wrap="nowrap" style={{ flex: 1 }}>
            {Icon && <Icon size={14} style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />}
            <Text size="xs" fw={500} c="dimmed" truncate="end">{label}</Text>
        </Group>

        <Group gap={0} style={{
            background: 'light-dark(rgba(0,0,0,0.03), rgba(255,255,255,0.05))',
            borderRadius: 6,
            padding: 2,
            border: '1px solid light-dark(rgba(0,0,0,0.05), rgba(255,255,255,0.06))'
        }}>
            {options.map((opt) => {
                const active = value === opt.value;
                return (
                    <Tooltip key={opt.value} label={opt.label} position="top" withArrow openDelay={400}>
                        <ActionIcon
                            size="sm"
                            variant={active ? 'white' : 'subtle'}
                            color={active ? 'blue' : 'gray'}
                            onClick={() => onChange(opt.value)}
                            style={{
                                width: 28,
                                height: 24,
                                borderRadius: active ? 4 : 4,
                                backgroundColor: active ? 'light-dark(#fff, rgba(255,255,255,0.1))' : 'transparent',
                                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                color: active ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)',
                                transition: 'all 0.1s ease',
                                border: 'none'
                            }}
                        >
                            <opt.icon size={13} strokeWidth={active ? 2.5 : 2} />
                        </ActionIcon>
                    </Tooltip>
                );
            })}
        </Group>
    </Group>
);

/** Menu row for custom dropdown content */
export const MenuRowCustom = ({ icon: Icon, label, value, children, opened, onOpenChange }: any) => {
    const [hover, setHover] = useState(false);

    return (
        <Menu
            position="right-start"
            offset={15}
            shadow="md"
            withinPortal={true}
            closeOnItemClick={false}
            opened={opened}
            onChange={onOpenChange}
        >
            <Menu.Target>
                <UnstyledButton
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: 4,
                        background: hover ? 'light-dark(rgba(0,0,0,0.03), rgba(255,255,255,0.05))' : 'transparent',
                        transition: 'background 0.1s'
                    }}
                >
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <Group gap={8} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                            {Icon && <Icon size={14} style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }} />}
                            <Text size="xs" fw={400} truncate="end" style={{ color: 'light-dark(var(--mantine-color-gray-8), var(--mantine-color-dark-0))' }}>{label}</Text>
                        </Group>
                        <Group gap={4} wrap="nowrap" style={{ flexShrink: 0, minWidth: 0, maxWidth: '50%' }}>
                            {value && <Text size="xs" c="dimmed" truncate="end">{value}</Text>}
                            <ChevronRight size={14} style={{ color: 'var(--mantine-color-gray-4)', flexShrink: 0 }} />
                        </Group>
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown p={0}>
                {children}
            </Menu.Dropdown>
        </Menu>
    );
};
