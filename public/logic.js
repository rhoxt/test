import { addEventListener, openSocket, send } from "./socket.js";

openSocket().then(() => {
    console.log("socket was successfully opened")
    const addGameBtn = document.querySelector('#addGame');
    addGameBtn.addEventListener("click", addGame);

    addEventListener("fetchGamesResult", onFetchGames)

    fetchGames();
});

function addGame () {
       const data = {
        date: new Date(Date.now()).getTime(),
        team1player1: app.team1player1 || "team1player1",
        team1player2: app.team1player2 || "team1player2",
        team1score: app.team1score || 0,
        team2player1: app.team2player1 || "team2player1",
        team2player2: app.team2player2 || "team2player2",
        team2score: app.team2score || 0,
    };

    console.log(data);

    send("addGame", data);
    addEventListener("addGameResult", onAddGame)
}

function fetchGames () {
    send("fetchGames", {});
}

function onFetchGames (data) {
    console.log("recieved some games", data);

    data.forEach(element => {
        delete element._id;
        delete element.__v;
        element.result = element.team1score + " - " +element.team2score;
        var oMilliseconds = new Date(element.date)
        element.date = oMilliseconds.getDate() + "." +oMilliseconds.getMonth() + "." +oMilliseconds.getFullYear();
    });

    app.items = data;
}

function onAddGame (data) {
    console.log("addGame successful", data);
    removeEventListener("addGame", onAddGame)

    fetchGames();
}
