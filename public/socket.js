import { logoff, shouldCloseConnection } from "./logoff.js";
import { Deferred } from "./Deferred.js";
import { Timer } from "./Timer.js";

let wsDeferred = null;

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

function handleClose () {
    wsDeferred = null;
    timer.clear();
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

export async function send (channel, data) {
    if (channel !== "ping") {
        timer.reset();
    }
    const ws = await getSocket();
    if (!ws) {
        return;
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

async function getSocket () {
    if (!wsDeferred) {
        openSocket();
    }
    try {
        const ws = await wsDeferred.promise;
        return ws;
    } catch (err) {
        console.error("Websocket could not be opened");
    }
}

function openSocket () {
    wsDeferred = new Deferred();

    addEventListener("userId", (data) => {
        userId = data.id;
    });

    const host = globalThis.location.origin.replace(/^http/, "ws");
    const ws = new WebSocket(`${host}/ws`);

    ws.onmessage = handleMessage;
    ws.onopen = () => {
        timer.start();
        wsDeferred.resolve(ws)
    };
    ws.onclose = handleClose;
    ws.onerror = handleClose;
}
