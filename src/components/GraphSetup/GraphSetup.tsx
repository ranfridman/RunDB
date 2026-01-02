import { Alert, Box, Button, Card, Group, SegmentedControl, Stack, Text, Textarea, Title } from "@mantine/core";
import { ChartArea, Play } from "lucide-react";
import { typeToColor } from "../TypesTheme/TypesTheme";
import { Mermaid } from "../Mermaid/Mermaid";
import { graphExamples } from "./GraphSetupExamples";
import { useState } from "react";
import { ContentCard } from "../ContentCard/ContentCard";
import styles from "./GraphSetup.module.css";

const graphTypes = [
    { label: 'Flow Chart', value: 'flowchart' },
    { label: 'Plot Graph', value: 'xychart' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Timeline', value: 'timeline' },
    { label: 'Area', value: 'area' },
]
const color = typeToColor["Graph"];

interface GraphSetupProps {
    onRun: () => void;
}

export const GraphSetup: React.FC<GraphSetupProps> = ({ onRun }) => {
    const [graph, setGraph] = useState<string>("");
    const [graphType, setGraphType] = useState<string>("pie");
    return (
        <>
            <Card w="100%" p="0" pt="xs" >
                <Group w="100%" justify="space-between" gap={0} px="sm" py="0">
                    <SegmentedControl
                        color={color}
                        w="82%" variant="subtle"
                        radius="lg" onChange={setGraphType} bg="gray.9" withItemsBorders={false} value={graphType} size="xs"
                        data={graphTypes} />
                    <Button
                        leftSection={<Play size="15" />}
                        w="18%"
                        variant="filled"
                        size="compact-sm"
                        color={color}
                        radius="md"
                        my="xs"
                        onClick={onRun}>
                        Run
                    </Button>
                </Group>

                <Box w="100%"  >
                    <ContentCard type="Graph" padding="0" isStreaming={false} title={`Example ${graphTypes.find((type) => type.value === graphType)?.label}`}>
                        <Group justify="center" align="center" w="100%" h="27em" display="flex" >
                            <Mermaid
                                chart={graphExamples[graphType as keyof typeof graphExamples] || ""}
                                theme="dark"
                            />
                        </Group>
                    </ContentCard>
                    <Alert variant="light" my={0} py="xs" mx="md" color={color} title="Alert title" icon={<ChartArea />}>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. At officiis, quae tempore necessitatibus placeat saepe.
                    </Alert>
                </Box >
            </Card>

        </>
    );
}