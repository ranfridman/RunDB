import { Box, CheckIcon, ColorSwatch, Group, Menu, SimpleGrid, Switch, Text, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { TabProps, PRESET_COLORS } from './types';

export const DataColorsTab = ({ config, setConfig, availableKeys, openKey, setOpenKey }: TabProps & { availableKeys: string[], openKey: string | null, setOpenKey: (key: string | null) => void }) => {
    const toggleY = (key: string, on: boolean) => {
        setConfig(p => ({
            ...p,
            yAxisKeys: on ? [...p.yAxisKeys, key] : p.yAxisKeys.filter(k => k !== key),
        }));
    };

    return (
        <>
            {availableKeys.map(key => {
                const isX = config.xAxisKey === key;
                if (isX) return null; // Only show non-X keys for the Y-axis / colors sub-menu

                const isY = config.yAxisKeys.includes(key);
                const color = config.seriesColors?.[key] ?? '#228be6';

                return (
                    <Group key={key} justify="space-between" align="center" wrap="nowrap" style={{ padding: '6px 8px' }}>
                        <Group gap={8} wrap="nowrap">
                            <Menu shadow="md" width={216} position="right-start" offset={15} withinPortal={true} closeOnItemClick={false} opened={openKey === key} onChange={(o) => setOpenKey(o ? key : null)}>
                                <Menu.Target>
                                    <Box
                                        onClick={() => setOpenKey(key)}
                                        style={{
                                            width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                                            background: color, cursor: 'pointer',
                                            boxShadow: `0 0 0 2px ${color}40`,
                                        }}
                                    />
                                </Menu.Target>
                                <Menu.Dropdown p="sm">
                                    <Text size="xs" fw={600} c="dimmed" mb={7} style={{ letterSpacing: '0.05em' }}>COLOR</Text>
                                    <SimpleGrid cols={5} spacing={5}>
                                        {PRESET_COLORS.map(pc => (
                                            <Tooltip key={pc} label={pc} fz={10} withArrow>
                                                <ColorSwatch
                                                    color={pc} size={26}
                                                    style={{ cursor: 'pointer', borderRadius: 5 }}
                                                    onClick={() => {
                                                        setConfig(p => ({ ...p, seriesColors: { ...p.seriesColors, [key]: pc } }));
                                                        setOpenKey(null);
                                                    }}
                                                >
                                                    {color === pc && <CheckIcon width={9} />}
                                                </ColorSwatch>
                                            </Tooltip>
                                        ))}
                                    </SimpleGrid>
                                </Menu.Dropdown>
                            </Menu>
                            <Text size="xs" c={isY ? undefined : 'dimmed'}>{key}</Text>
                        </Group>
                        <Switch
                            size="xs"
                            checked={isY}
                            onChange={e => toggleY(key, e.currentTarget.checked)}
                            color={color}
                        />
                    </Group>
                );
            })}
        </>
    );
};
