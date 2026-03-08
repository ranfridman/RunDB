import { ActionIcon, Box, CheckIcon, ColorSwatch, Group, Menu, SimpleGrid, Stack, Switch, Text, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { TabProps, PRESET_COLORS } from './types';

export const DataColorsTab = ({ config, setConfig, availableKeys }: TabProps & { availableKeys: string[] }) => {
    const [openColorKey, setOpenColorKey] = useState<string | null>(null);

    const promoteToX = (key: string) => {
        setConfig(prev => {
            const oldX = prev.xAxisKey;
            const newY = prev.yAxisKeys.filter(k => k !== key);
            if (oldX && !newY.includes(oldX)) newY.push(oldX);
            return { ...prev, xAxisKey: key, yAxisKeys: newY };
        });
    };

    const toggleY = (key: string, on: boolean) => {
        setConfig(p => ({
            ...p,
            yAxisKeys: on ? [...p.yAxisKeys, key] : p.yAxisKeys.filter(k => k !== key),
        }));
    };

    return (
        <Stack gap={4} mt={8}>
            {availableKeys.map(key => {
                const isX = config.xAxisKey === key;
                const isY = config.yAxisKeys.includes(key);
                const color = config.seriesColors?.[key] ?? '#228be6';

                return (
                    <Group key={key} gap={6} align="center" wrap="nowrap" style={{ padding: '4px 2px' }}>
                        {/* Color dot — opens picker for Y-series */}
                        {isY ? (
                            <Menu shadow="md" width={216} position="bottom-start" withinPortal opened={openColorKey === key} onClose={() => setOpenColorKey(null)}>
                                <Menu.Target>
                                    <Box
                                        onClick={() => setOpenColorKey(key)}
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
                                                        setOpenColorKey(null);
                                                    }}
                                                >
                                                    {color === pc && <CheckIcon width={9} />}
                                                </ColorSwatch>
                                            </Tooltip>
                                        ))}
                                    </SimpleGrid>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Box
                                style={{
                                    width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                                    background: isX ? 'var(--mantine-color-teal-filled)' : 'light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.12))',
                                    boxShadow: isX ? '0 0 0 2px light-dark(rgba(18, 184, 134, 0.2), rgba(99, 230, 190, 0.3))' : 'none',
                                }}
                            />
                        )}

                        {/* Key name */}
                        <Text
                            size="xs"
                            fw={isX || isY ? 600 : 400}
                            c={isX ? 'teal' : isY ? undefined : 'dimmed'}
                            truncate
                            style={{ flex: 1 }}
                        >
                            {key}
                        </Text>

                        {/* X pill — click any non-X row to promote it */}
                        <Tooltip label={isX ? 'X axis' : 'Set as X axis'} position="top" withArrow fz="xs">
                            <Box
                                onClick={() => !isX && promoteToX(key)}
                                style={{
                                    fontSize: 10, fontWeight: 700, lineHeight: 1,
                                    padding: '2px 6px', borderRadius: 4,
                                    cursor: isX ? 'default' : 'pointer',
                                    userSelect: 'none',
                                    color: isX ? 'light-dark(var(--mantine-color-teal-8), #63e6be)' : 'light-dark(rgba(0,0,0,0.2), rgba(255,255,255,0.2))',
                                    border: `1px solid ${isX ? 'light-dark(rgba(18, 184, 134, 0.4), rgba(99,230,190,0.4))' : 'light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.1))'}`,
                                    background: isX ? 'light-dark(rgba(18, 184, 134, 0.1), rgba(99,230,190,0.1))' : 'transparent',
                                    transition: 'all 0.15s',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => { if (!isX) (e.currentTarget as HTMLElement).style.color = 'light-dark(rgba(0,0,0,0.5), rgba(255,255,255,0.5))'; }}
                                onMouseLeave={e => { if (!isX) (e.currentTarget as HTMLElement).style.color = 'light-dark(rgba(0,0,0,0.2), rgba(255,255,255,0.2))'; }}
                            >
                                X
                            </Box>
                        </Tooltip>

                        {/* Y toggle — hidden for X axis */}
                        {!isX && (
                            <Switch
                                size="xs"
                                checked={isY}
                                onChange={e => toggleY(key, e.currentTarget.checked)}
                                color={color}
                            />
                        )}
                        {isX && <Box style={{ width: 32 }} />}
                    </Group>
                );
            })}
        </Stack>
    );
};
