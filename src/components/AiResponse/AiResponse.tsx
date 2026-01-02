import { useStreamAIResponse } from "@/api/stream";
import { useEffect, useState } from "react";
import Response from "../Response/Response";

interface AiResponseProps {
    mode: "graph" | "analysis";
    prompt: string;
}

export const AiResponse = ({ mode, prompt }: AiResponseProps) => {
    const [streamedData, setStreamedData] = useState("");
    const t = useStreamAIResponse({ mode: mode, prompt: prompt })
    useEffect(() => {
        t.mutate((chunk) => {
            setStreamedData((prev) => prev + chunk);
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