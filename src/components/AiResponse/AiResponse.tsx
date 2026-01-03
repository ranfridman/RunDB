import { useStreamAIResponse } from "@/api/stream";
import { useEffect, useState } from "react";
import Response from "../Response/Response";

export interface Stage {
    title: string;
    description: string;
    status: "processing" | "finished" | "notStarted";
}

interface AiResponseProps {
    mode: "graph" | "analysis";
    prompt: string;
    onStagesUpdate?: (stages: Stage[]) => void;
}

export const AiResponse = ({ mode, prompt, onStagesUpdate }: AiResponseProps) => {
    const [streamedData, setStreamedData] = useState("");
    const [rawStream, setRawStream] = useState("");
    const t = useStreamAIResponse({ mode: mode, prompt: prompt })

    const parseStages = (text: string) => {
        const regex = /```stage\n([\s\S]*?)\n```/g;
        const stages: Stage[] = [];
        let match;
        let cleanText = text;

        while ((match = regex.exec(text)) !== null) {
            const content = match[1];
            const stage: Record<string, string> = {};

            const fieldRegex = /(\w+):\s*([\s\S]*?)<\$>/g;
            let fieldMatch;

            while ((fieldMatch = fieldRegex.exec(content)) !== null) {
                const key = fieldMatch[1].trim();
                const value = fieldMatch[2].trim();
                stage[key] = value;
            }

            if (stage.title) {
                stages.push({
                    title: stage.title,
                    description: stage.description || "",
                    status: (stage.status as Stage["status"]) || "processing"
                });
            }
        }

        cleanText = text.replace(regex, '');
        return { stages, cleanText };
    };

    useEffect(() => {
        t.mutate((chunk) => {
            setRawStream((prev) => {
                const newRaw = prev + chunk;
                const { stages, cleanText } = parseStages(newRaw);

                // Update stages if any found
                if (stages.length > 0) {
                    onStagesUpdate?.(stages);
                }
                setStreamedData(cleanText);
                return newRaw;
            });
        });
    }, []);

    return (
        <>
            <Response isAnimating={t.isPending}>
                {streamedData}
            </Response>
        </>
    )
}