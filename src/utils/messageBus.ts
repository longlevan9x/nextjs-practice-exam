// utils/messageBus.ts

type Callback = (data: any) => void;

const listeners: { [action: string]: Callback[] } = {};

export function onMessage(action: string, callback: Callback) {
    if (!listeners[action]) {
        listeners[action] = [];
    }
    listeners[action].push(callback);
}

export function offMessage(action: string, callback: Callback) {
    if (listeners[action]) {
        listeners[action] = listeners[action].filter(cb => cb !== callback);
    }
}

export function emitMessage(action: string, data: any) {
    if (listeners[action]) {
        listeners[action].forEach(cb => cb(data));
    }
}
