import { Box, Divider, Group, ScrollArea } from "@mantine/core";
import Response from "../Response/Response";
import { GraphSetup } from "../GraphSetup/GraphSetup";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AIPanelInput } from "../AIPanelInput/AIPanelInput";


interface AIPanelProps {
    label: string;
    type: string;
    id: string;
}


export const AIPanel: React.FC<AIPanelProps> = ({ label, type, id }) => {
    const url = "https://r.jina.ai/https://en.wikipedia.org/wiki/Comparison_of_Linux_distributions";
    const [panelMode, setPanelMode] = useState<'setup' | 'loading' | 'finished'>('setup');
    const { data, isLoading } = useQuery({
        queryKey: ['markdown', url],
        queryFn: async () => {
            const response = await fetch(url);
            return response.text();
        },
    });

    return (
        <>
            <Group justify="space-between" w="100%" dir='row' gap="0" h="87vh" align="top" >
                {/* <NavigationProgress /> */}

                <Box w="30em">
                    <AIPanelInput />
                    {type === "Graph" && panelMode === "setup" && <GraphSetup />}
                </Box>
                <Divider orientation="vertical" mx={0} />
                <Box w="calc(99% - 30em)">
                    <ScrollArea type="scroll" scrollbarSize={2} offsetScrollbars h="86vh">
                        {
                            panelMode != "setup" && (
                                <Response isAnimating={isLoading}>
                                    {data}
                                </Response>
                            )
                        }
                    </ScrollArea>
                </Box>
            </Group>
        </>
    );
}