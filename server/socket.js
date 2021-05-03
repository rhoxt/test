const path = require('path');
const { createServer } = require('http');
const express = require('express');
const WebSocket = require('ws');

const { UserManager } = require('./UserManager.js');

const port = parseInt(process.env.PORT, 10) || 8080;
const host = process.env.PORT ? '0.0.0.0' : 'localhost';

const publicPath = path.join(__dirname, '../public');

const app = express();
const httpServer = createServer(app);
const socketOptions = {
    path: '/ws',
    server: httpServer,
};
const wss = new WebSocket.Server(socketOptions);

const messageHandler = new Map();

/**
 * Registers to a websocket channel and calls the handler
 * @param {string} channel
 * @param {function} callback
 * @param {object} scope
 */
function registerMessageHandler (channel, callback, scope) {
    let handlerMap = messageHandler.get(channel);
    if (handlerMap === undefined) {
        handlerMap = new Map();
        messageHandler.set(channel, handlerMap);
    }
    handlerMap.set(callback, scope);
}

/**
 * Sends data via a channel to a specific websocket connection
 * @param {websocket} ws
 * @param {string} channel
 * @param {object} data
 */
function send (ws, channel, data) {
    const message = JSON.stringify({
        channel,
        data,
    });
    ws.send(message);
}

/**
 * Parses the incoming data
 * @param {string} data
 * @returns {object} The parsed data
 */
function parseMessage (data) {
    if (typeof data !== 'string') {
        return data;
    }

    let oResult = {};
    try {
        const string = data;
        oResult = JSON.parse(string);
    } catch (err) {
        globalThis.console.log(err);
    }
    return oResult;
}

/**
 * Handles the websocket open event and assigns a id
 * @param {object} ws The websocket object
 * @returns {string} The id of the new user
 */
function handleOpen (ws) {
    globalThis.console.log('WebSocket opens');
    ws.id = UserManager.addUser();
    send(ws, 'userId', {
        id: ws.id,
    });
    return ws.id;
}

/**
 * Handles incoming messages and calls the listener
 * @param {object} ws The websocket object
 * @param {string} data The data sended by the user
 */
function handleMessage (ws, data) {
    const message = parseMessage(data);

    if (message.channel) {
        const handlerMap = messageHandler.get(message.channel) || new Map();

        try {
            handlerMap.forEach((scope, callback) => {
                callback.call(scope, ws, message.data, ws.id);
            });
        } catch (err) {
            globalThis.console.error(err);
        }
    }
}

/**
 * Handles websocket close and removes the user
 * @param {string} userId
 */
function handleClose (userId) {
    const ws = {
        id: userId,
    };
    handleMessage(ws, {
        channel: 'close',
        data: {},
    });
    UserManager.removeUser(userId);
    globalThis.console.log('WebSocket closed');
}

/**
 * Starts the file server and websocket server
 */
function startServer () {
    const expressOptions = {
        index: 'index.html',
    };

    app.use(express.static(publicPath, expressOptions));

    wss.on('connection', (ws) => {
        const userId = handleOpen(ws);

        ws.on('message', handleMessage.bind(null, ws));

        ws.on('close', handleClose.bind(null, userId));
    });

    httpServer.listen(port, host, () => {
        globalThis.console.log(`Listening to http://${host}:${port}`);
    });
}

module.exports = {
    startServer,
    send,
    registerMessageHandler,
};
