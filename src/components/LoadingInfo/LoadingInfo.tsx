import { Divider, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { LoadingInfoStage, LoadingInfoStageProps } from "../LoadingInfoStage/LoadingInfoStage";
import { LayoutList } from "lucide-react";






interface LoadingInfoProps {
    stages: LoadingInfoStageProps[];
    color: string;
}

export const LoadingInfo: React.FC<LoadingInfoProps> = ({ stages, color }) => {
    return (
        <>
            <Stack gap="xs" p="md">
                <Group gap="xs" align="center" >
                    <ThemeIcon variant="filled" radius="lg" color={color}>
                        <LayoutList size={16} />
                    </ThemeIcon>
                    <Text fz="h5">Thinking Stages</Text>
                </Group>
                <Divider />
                {stages.map((stage, index) => (
                    <LoadingInfoStage key={index} {...stage} status={stage.status === "finished" || index !== stages.length - 1 ? "finished" : "processing"} color={color} />
                ))}
                {stages[stages.length - 1]?.status !== "finished" && (
                    <LoadingInfoStage key={stages.length} title="" description="" status="notStarted" color={color} />
                )}
            </Stack>
        </>
    );
}