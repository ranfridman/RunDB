import { ActionIcon, Card, Group, Progress, Skeleton, Stack, Text, Title } from "@mantine/core";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";




export interface LoadingInfoStageProps {
    title: string;
    description: string;
    status?: "notStarted" | "processing" | "finished";
    color?: string;
}
export const useAsymptoticProgress = (isProcessing: boolean) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (!isProcessing) {
            setProgress(0);
            return;
        }
        const startTime = Date.now();
        const k = 0.03;  // Faster but still manageable
        const n = 1.2;   // n > 1 ensures it starts slowly (zero acceleration at 0)
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;

            // Asymptotic curve: 98 * (1 - e^(-k * t^n))
            let nextValue = 98 * (1 - Math.exp(-k * Math.pow(elapsed, n)));

            // Add a tiny bit of organic movement so it doesn't look like a static math function
            nextValue += (Math.random() - 0.5) * 0.1;

            setProgress(Math.max(0, Math.min(nextValue, 98)));
        }, 100);
        return () => clearInterval(interval);
    }, [isProcessing]);
    return progress;
};

export const LoadingInfoStage: React.FC<LoadingInfoStageProps> = ({ title, description, status, color }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const fakeProgress = useAsymptoticProgress(status === "processing");

    return (
        <>
            <Group gap="0" align="stretch">
                <Progress
                    animated={status === "processing"}
                    value={status === "notStarted" ? 0 : status === "processing" ? fakeProgress : 100}
                    orientation="vertical"
                    size="xs"
                    color={color}
                    style={{ transform: "rotate(180deg)" }}
                />
                <Card radius="md" flex={1} p="xs" pl="xs" pt="5" bg="gray.9" >
                    <Stack gap="0.2em" justify="center">
                        {status === "notStarted" && (
                            <>
                                <Skeleton height={12} mt="5" width="80%" />
                                <Skeleton height={10} mt="5" width="60%" />
                            </>
                        )}
                        {status !== "notStarted" &&
                            <Group gap="5" align="top" justify="space-between">
                                <Text lineClamp={isExpanded ? 0 : 1} w="91%" fz="h6" fw={600} c="gray.1" component="h6">{title}</Text>
                                <ActionIcon size="xs" variant="transparent" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.1s ease-in-out" }} onClick={() => setIsExpanded(!isExpanded)}>
                                    <ChevronDown />
                                </ActionIcon>
                            </Group>

                        }
                        {status !== "notStarted" && <Text lineClamp={isExpanded ? 0 : 1} fz="xs" c="dimmed">{description}</Text>}
                    </Stack>
                </Card>
            </Group>
        </>
    );
};