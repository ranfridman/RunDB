import React from 'react';
import { alpha, Box, Button, Card, Center, darken, Flex, Grid, Group, Overlay, Stack, Text, Transition } from "@mantine/core"
import { getIconByType, typeToColor } from "../TypesTheme/TypesTheme";

import styles from './NewTabOptions.module.css';
import { tabData } from '../InfoArea/InfoArea';

interface TabOptionButtonProps {
    label: string;
    description: string;
    type: string;
    createNewTab: (tab: tabData) => void;
}

const TabOptionButton: React.FC<TabOptionButtonProps> = ({ label, description, type, createNewTab }) => {
    const color = typeToColor[type ?? '']
    return (

        <Button
            justify="start"
            className={styles.button}
            variant="gradient"
            gradient={{ from: `${color}.3`, to: `${color}.9`, deg: 135 }}
            p="0.2em"
            onClick={() => createNewTab({ label, id: Date.now().toString(), type })}
            w="20em"
            h="10em"
        >
            <Card h="100%" w="20em" >
                <Group gap="xs" h="5em">
                    {getIconByType(type, 25)}
                    <Text size="xl" fw={500}>{label}</Text>
                </Group>
                <Group h="5em">
                    <Text size="md" c="dimmed" lineClamp={3} style={{ whiteSpace: "normal", textAlign: "left" }}>{description}</Text>
                </Group>
            </Card>

        </Button>
    )
}

interface NewTabOptionsProps {
    createNewTab: (tab: tabData) => void;
}

export const NewTabOptions: React.FC<NewTabOptionsProps> = ({ createNewTab }) => {

    return (
        <Group h="60vh" justify="center" w="100%" p="md" pos="relative">

            <Stack justify="center" w="36em">
                <Stack gap="0">
                    <Text size="xl" fw={500}>Start with a tab option</Text>
                    <Text size="md" c="dimmed">Choose a tab option to get started</Text>
                </Stack>
                <Grid gutter="md" columns={2}>
                    <Grid.Col span={1}>
                        <TabOptionButton
                            label="Table"
                            description="Organize your raw data into a structured, sortable, and filterable table format for easy scanning."
                            type="Table"
                            createNewTab={createNewTab}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <TabOptionButton
                            label="Graph"
                            description="Visualize trends and patterns in your data with dynamic, interactive charts and graphs."
                            type="Graph"
                            createNewTab={createNewTab}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <TabOptionButton
                            label="SQL"
                            description="Generate optimized SQL queries to extract, transform, and analyze your data directly from your database."
                            type="SQL"
                            createNewTab={createNewTab}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <TabOptionButton
                            label="Analysis"
                            description="Perform a deep-dive analysis to uncover hidden insights, correlations, and actionable intelligence."
                            type="Analysis"
                            createNewTab={createNewTab}
                        />
                    </Grid.Col>
                </Grid>
            </Stack>
        </Group>
    )
}