import { Box, Group, Switch, Text } from '@mantine/core';

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
export const ToggleRow = ({ label, checked, onChange }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <Group justify="space-between" align="center" wrap="nowrap" style={{ padding: '1px 0' }}>
        <Text size="xs" c={checked ? undefined : 'dimmed'} fw={checked ? 500 : 400}
            style={{ transition: 'color 0.15s' }}>
            {label}
        </Text>
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
