import { addEventListener, openSocket, send } from "./socket.js";

openSocket().then(() => {
    console.log("socket was successfully opened")
    const addGameBtn = document.querySelector('#addGame');
    addGameBtn.addEventListener("click", addGame);

    const fetchGamesBtn = document.querySelector('#fetchGames');
    fetchGamesBtn.addEventListener("click", fetchGames);

    addEventListener("fetchGames", onFetchGames)
});

function addGame () {
    const date = document.querySelector("#date");
    const player1 = document.querySelector("#player1");
    const scorePlayer1 = document.querySelector("#scorePlayer1");
    const player2 = document.querySelector("#player2");
    const scorePlayer2 = document.querySelector("#scorePlayer2");

    const data = {
        date: new Date(date.value || Date.now()).getTime(),
        player1: player1.value || "player1",
        scorePlayer1: scorePlayer1.value || 1,
        player2: player2.value || "player2",
        scorePlayer2: scorePlayer2.value || 2,
    };

    send("addGame", data);
    addEventListener("addGame", onAddGame)
}

function fetchGames () {
    send("fetchGames", {});
}

function onFetchGames (data) {
    console.log("recieved some games", data);
}

function onAddGame (data) {
    console.log("addGame successful", data);
    removeEventListener("addGame", onAddGame)
}
