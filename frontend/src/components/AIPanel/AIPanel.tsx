import { Box, Center, Divider, Group, ScrollArea, Stack, Text, ThemeIcon } from "@mantine/core";
import { GraphSetup } from "../GraphSetup/GraphSetup";
import { AnalysisSetup } from "../AnalysisSetup/AnalysisSetup";
import { useState } from "react";
import { AIPanelInput } from "../AIPanelInput/AIPanelInput";
import { LoadingInfo } from "../LoadingInfo/LoadingInfo";
import { getIconByType, typeToColor } from "../TypesTheme/TypesTheme";
import { AiResponse, Stage } from "../AiResponse/AiResponse";


interface AIPanelProps {
    label: string;
    type: string;
    id: string;
    intialQuery?: string;
}




export const AIPanel: React.FC<AIPanelProps> = ({ label, type, id, intialQuery }) => {
    const [panelMode, setPanelMode] = useState<'setup' | 'loading' | 'finished'>('setup');
    const [query, setQuery] = useState<string>(intialQuery || "");
    const [stages, setStages] = useState<Stage[]>([]);

    const typeToSetup: { [key: string]: React.ReactNode } = {
        Graph: <GraphSetup onRun={() => setPanelMode('loading')} />,
        Analysis: <AnalysisSetup onRun={() => setPanelMode('loading')} />,
    }

    return (
        <>
            <Group justify="space-between" w="100%" dir='row' gap="0" h="89.7vh" align="top" >
                <Box w="30em">
                    <AIPanelInput
                        type={type}
                        initialQuery={query}
                        isActive={panelMode === "setup"}
                        onQueryChange={setQuery}
                        onBack={() => setPanelMode('setup')}
                    />
                    {panelMode === "setup" && typeToSetup[type]}
                    {panelMode === "loading" && <LoadingInfo color={typeToColor[type]} stages={stages} />}
                </Box>
                <Divider orientation="vertical" mx={0} />
                <Box w="calc(99% - 30em)">
                    <ScrollArea type="scroll" scrollbarSize={2} offsetScrollbars h="89vh">
                        {
                            panelMode === "setup" && <Center c="dimmed" h="60vh">
                                <Stack justify="center" align="center" gap="5">
                                    <Group gap="5" justify="center" align="baseline">
                                        <ThemeIcon variant="transparent" size={27}>
                                            {getIconByType(type, 40)}
                                        </ThemeIcon>
                                        <Text size="xl" c="gray.1">Setup the input form</Text>
                                    </Group>
                                    <Divider w="20em" />
                                    <Text size="sm" c="dimmed" ta="center" w="25em">
                                        Before loading the data, you need to fill the input fields. Make sure to fill all the required fields. and the data will be loaded automatically.
                                    </Text>
                                </Stack>
                            </Center>
                        }
                        {
                            panelMode != "setup" && (
                                <AiResponse mode={type === "Graph" ? "graph" : "analysis"} prompt={query} onStagesUpdate={setStages} />
                            )
                        }
                    </ScrollArea>
                </Box>
            </Group >
        </>
    );
}
