// hooks/useWindowMessage.ts
import { useEffect, useState } from "react";
import { onMessage, offMessage } from "@/utils/messageBus";

export function useWindowMessage<T = any>(action: string) {
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        const handler = (payload: T) => {
            setData(payload);
        };
        onMessage(action, handler);
        return () => offMessage(action, handler);
    }, [action]);

    return data;
}
