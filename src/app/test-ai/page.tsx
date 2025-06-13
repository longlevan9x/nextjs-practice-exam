"use client";

import { EVENT_ACTION } from "@/constants/windowMessage";
import { useWindowMessage } from "@/hooks/useWindowMessage";
import { windowPostMessage } from "@/services/windowMessageService";
import { useEffect, useRef, useState } from "react";

const TestAI: React.FC = () => {
    const gptPayload = useWindowMessage<{ content: string }>(EVENT_ACTION.GPT_STREAM_PART);
    const [prompt, setPrompt] = useState("");
    const [displayContent, setDisplayContent] = useState("");
    const fullContentRef = useRef(""); // giữ nội dung đầy đủ
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const btnOnClick = () => {
        windowPostMessage(EVENT_ACTION.SEND_PROMPT, { prompt });
        fullContentRef.current = "";
        setDisplayContent("");
    };

    useEffect(() => {
        if (gptPayload?.content) {
            fullContentRef.current += gptPayload.content;

            if (!timeoutRef.current) {
                timeoutRef.current = setTimeout(() => {
                    setDisplayContent(fullContentRef.current);
                    timeoutRef.current = null;
                }, 100); // chỉ update 10 lần mỗi giây
            }
        }
    }, [gptPayload]);

    return (
        <>
            <div>
                <h1>Test AI Component</h1>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Nhập nội dung"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <pre className="whitespace-pre-wrap p-2 mt-4 rounded h-60 overflow-auto">
                    {displayContent}
                </pre>
            </div>
            <button onClick={btnOnClick} className="p-4 mt-4 bg-gray-500 hover:bg-gray-600 text-white rounded">
                Gửi dữ liệu
            </button>
        </>
    );
};

export default TestAI;
