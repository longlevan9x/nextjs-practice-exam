// components/common/WindowMessageListener.tsx
"use client";

import { useEffect } from "react";
import { emitMessage } from "@/utils/messageBus";
import { isInValidEventFromExt } from "@/services/windowMessageService";

export default function WindowMessageListener() {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (isInValidEventFromExt(event)) return;
            emitMessage(event.data.action, event.data.payload);
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    return null; // không render gì cả
}
