const { DatabaseManager } = require("./DatabaseManager.js");
const { registerMessageHandler, send, publish } = require("./socket.js");

function startListen () {
    registerMessageHandler("fetchGames", onFetchGames);

    registerMessageHandler("addGame", onAddGame);
    registerMessageHandler("fetchPlayers", onFetchPlayers);
    registerMessageHandler("addPlayer", onAddPlayer);
}

async function onFetchGames (ws, data, userId) {
    console.log(`user ${userId} is trying to fetch games`);

    const games = await DatabaseManager.fetchGames();

    send(ws, "fetchGamesResult", games);
}

async function onAddGame (ws, data, userId) {
    console.log(`user ${userId} is trying to add a game`);
    // we might add some validation or default values
    const returnedGame = await DatabaseManager.addGame(data);

    // send(ws, "addGameResult", returnedGame);
    publish("all", "addGameResult", returnedGame);
}

async function onFetchPlayers (ws, data, userId) {
    console.log(`user ${userId} is trying to fetch players`);

    const players = await DatabaseManager.fetchPlayers();

    send(ws, "fetchPlayersResult", players);
}

async function onAddPlayer (ws, data, userId) {
    console.log(`user ${userId} is trying to add a player`);
    // we might add some validation or default values
    const returnedPlayer = await DatabaseManager.addPlayer(data);

    // send(ws, "addPlayerResult", returnedPlayer);
    publish("all", "addPlayerResult", returnedPlayer);
}

module.exports = {
    startListen
};
