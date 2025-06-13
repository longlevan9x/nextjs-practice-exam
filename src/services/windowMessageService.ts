import { EVENT_TYPE } from "@/constants/windowMessage"

export const windowPostMessage = (action: string, payload?: unknown) => {
    const data = {
        type: EVENT_TYPE.FROM_PAGE,
        action: action,
        payload: payload
    }

    window.postMessage(data, "*");
}

export const isInValidEventFromExt = (event: MessageEvent) => {
    if (event.source !== window || !event.data?.type || event.data.type != EVENT_TYPE.FROM_EXTENSION || !event.data.action) {
        return true;
    }

    return false;
}