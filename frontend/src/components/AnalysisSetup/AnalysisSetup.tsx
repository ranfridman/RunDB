import { Button, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Play, Sparkles, Zap, Search, Brain } from "lucide-react";
import { typeToColor } from "../TypesTheme/TypesTheme";
import styles from "./AnalysisSetup.module.css";

const color = typeToColor["Analysis"];

interface AnalysisSetupProps {
    onRun: () => void;
}

export const AnalysisSetup: React.FC<AnalysisSetupProps> = ({ onRun }) => {
    return (
        <Card w="100%" p="md" bg="transparent">
            <Stack gap="md">
                <Group justify="space-between">
                    <Text size="sm" fw={500} c="dimmed">ANALYSIS SETTINGS</Text>
                    <Button
                        leftSection={<Play size="15" />}
                        variant="filled"
                        size="xs"
                        color={color}
                        radius="md"
                        onClick={onRun}
                    >
                        Run Analysis
                    </Button>
                </Group>

                <Stack gap="xs">
                    <Group gap="xs" p="xs" className={styles.option}>
                        <ThemeIcon color={color} variant="light" size="sm">
                            <Sparkles size={14} />
                        </ThemeIcon>
                        <Box>
                            <Text size="xs" fw={500}>Deep Insight</Text>
                            <Text size="xs" c="dimmed">Use advanced LLM reasoning for discovery</Text>
                        </Box>
                    </Group>

                    <Group gap="xs" p="xs" className={styles.option}>
                        <ThemeIcon color={color} variant="light" size="sm">
                            <Brain size={14} />
                        </ThemeIcon>
                        <Box>
                            <Text size="xs" fw={500}>Pattern Recognition</Text>
                            <Text size="xs" c="dimmed">Identify correlations across tables</Text>
                        </Box>
                    </Group>

                    <Group gap="xs" p="xs" className={styles.option}>
                        <ThemeIcon color={color} variant="light" size="sm">
                            <Zap size={14} />
                        </ThemeIcon>
                        <Box>
                            <Text size="xs" fw={500}>Fast Analysis</Text>
                            <Text size="xs" c="dimmed">Optimized for quick summaries</Text>
                        </Box>
                    </Group>
                </Stack>
            </Stack>
        </Card>
    );
};

const Box = ({ children }: { children: React.ReactNode }) => <div style={{ flex: 1 }}>{children}</div>;
