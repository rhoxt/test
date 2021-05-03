import { logoff, shouldCloseConnection } from "./logoff.js";
import { Timer } from "./Timer.js";

let ws = null;

const PING_TIMEOUT = 30;
const timer = new Timer(PING_TIMEOUT, ping);

const handler = new Map();
let userId = null;

function handleMessage (evt) {
    const message = JSON.parse(evt.data);

    if (message.channel) {
        const handlerList = handler.get(message.channel) || new Map();
        handlerList.forEach((scope, callback) => {
            callback.call(scope, message.data);
        });
    }
}

export function addEventListener (channel, callback, scope) {
    let handlerMap = handler.get(channel);
    if (handlerMap === undefined) {
        handlerMap = new Map();
        handler.set(channel, handlerMap);
    }
    handlerMap.set(callback, scope);
}

export function removeEventListener (channel, callback) {
    const handlerMap = handler.get(channel);
    if (handlerMap !== undefined) {
        handlerMap.delete(callback);
    }
}

export function send (channel, data) {
    if (channel !== "ping") {
        timer.reset();
    }

    ws.send(JSON.stringify({
        channel,
        data,
    }));
}

export function getId () {
    return userId;
}

export function ping (wasReset) {
    if (!shouldCloseConnection()) {
        send("ping", {});
        if (!wasReset) {
            timer.start();
        }
    } else {
        timer.clear();
    }
}

export function openSocket () {
    return new Promise((resolve, reject) => {
        addEventListener("userId", (data) => {
            userId = data.id;
        });
        const host = globalThis.location.origin.replace(/^http/, "ws");
        ws = new WebSocket(`${host}/ws`);
        ws.onmessage = handleMessage;
        ws.onopen = resolve;
        ws.onclose = logoff;
        ws.onerror = logoff;

    }).then(() => {
        timer.start();
    })
}
