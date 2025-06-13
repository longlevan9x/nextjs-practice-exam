// hooks/useWindowMessage.ts
import { useEffect, useState } from "react";
import { onMessage, offMessage } from "@/utils/messageBus";

export function useWindowMessage<T = unknown>(action: string) {
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        const handler = (payload: unknown) => {
            setData(payload as T);
        };
        onMessage(action, handler);
        return () => offMessage(action, handler);
    }, [action]);

    return data;
}
