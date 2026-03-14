import { ActionIcon, Divider, Group, Paper, Stack, Text, UnstyledButton } from '@mantine/core';
import { Pencil, X, ChevronRight } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Panel, PanelActionsContext } from '../Dashboard/Board/types';

interface TableSettingsPanelProps {
    panel?: Panel;
    onClose: () => void;
}

export const TableSettingsPanel: React.FC<TableSettingsPanelProps> = ({ panel, onClose }) => {
    const actions = useContext(PanelActionsContext);
    const [hover, setHover] = useState(false);

    return (
        <Paper
            p="xs"
            onMouseDown={(e) => e.stopPropagation()}
            withBorder
            style={{
                width: 200,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Stack gap="5">
                <Group justify="space-between" align="center" >
                    <Text fw={600} size="sm">Table settings</Text>
                    <ActionIcon size="xs" variant="subtle" onClick={onClose} color="gray" radius="xl">
                        <X size={14} />
                    </ActionIcon>
                </Group>

                <Divider opacity={0.5} />

                <UnstyledButton
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => {
                        if (panel?.id) {
                            actions?.updatePanel(panel.id, { type: 'new' });
                            onClose();
                        }
                    }}
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
                            <Pencil size={14} style={{ color: 'var(--mantine-color-blue-5)', flexShrink: 0 }} />
                            <Text size="xs" fw={400} truncate="end" style={{ color: 'var(--mantine-color-blue-6)' }}>Edit source data</Text>
                        </Group>
                        <ChevronRight size={14} style={{ color: 'var(--mantine-color-blue-2)', flexShrink: 0 }} />
                    </Group>
                </UnstyledButton>

                <Divider opacity={0.5} />
            </Stack>
        </Paper>
    );
};
