const { DatabaseManager } = require("./DatabaseManager.js");
const { registerMessageHandler, send } = require("./socket.js");

function startListen () {
    registerMessageHandler("fetchGames", onFetchGames);
    registerMessageHandler("addGame", onAddGame);
}

async function onFetchGames (ws, data, userId) {
    console.log(`user ${userId} is trying to fetch games`);

    const games = await DatabaseManager.fetchGames();

    send(ws, "fetchGames", games);
}

async function onAddGame (ws, data, userId) {
    console.log(`user ${userId} is trying to add a game`);
    // we might add some validation or default values
    await DatabaseManager.addGame(data);

    send(ws, "addGame", {});
}

module.exports = {
    startListen
};
