import { addEventListener, openSocket, send } from "./socket.js";

openSocket().then(() => {
    console.log("socket was successfully opened")
    const addGameBtn = document.querySelector('#addGame');
    addGameBtn.addEventListener("click", addGame);

    const addPlayerBtn = document.querySelector('#addPlayer');
    addPlayerBtn.addEventListener("click", addPlayer);

    addEventListener("fetchGamesResult", onFetchGames)

    addEventListener("fetchPlayersResult", onFetchPlayers)

    fetchGames();
    fetchPlayers();
});

function addGame () {
    var team1player1 = app.team1player1._id;
    var team1player2 = app.team1player2._id;
    var team2player1 = app.team2player1._id;
    var team2player2 = app.team2player2._id;

    const data = {
        date: new Date(Date.now()).getTime(),
        team1player1:  team1player1 || "team1player1",
        team1player2: team1player2 || "team1player2",
        team1score: app.team1score || 0,
        team2player1: team2player1 || "team2player1",
        team2player2: team2player2|| "team2player2",
        team2score: app.team2score || 0,
    };

    console.log(data);

    send("addGame", data);
    addEventListener("addGameResult", onAddGame)
}

function addPlayer () {
    const data = {
        firstName: app.newPlayerFirstName || "",
        lastName: app.newPlayerLastName || "",
        nickName: app.newPlayerNickName || ""
    };

    console.log(data);

    send("addPlayer", data);
    addEventListener("addPlayerResult", onAddPlayer)
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
        if(!element.team1player1) {
            element.team1player1 = {firstName: "-", lastName: ""}
        }
        if(!element.team1player2) {
            element.team1player2 = {firstName: "-", lastName: ""}
        }
        if(!element.team2player1) {
            element.team2player1 = {firstName: "-", lastName: ""}
        }
        if(!element.team2player2) {
            element.team2player2 = {firstName: "-", lastName: ""}
        }

        element.team1player1Formatted = element.team1player1.firstName + " " + element.team1player1.lastName + " ";
        element.team1player2Formatted = element.team1player2.firstName + " " + element.team1player2.lastName + " ";
        element.team2player1Formatted = element.team2player1.firstName + " " + element.team2player1.lastName + " ";
        element.team2player2Formatted = element.team2player2.firstName + " " + element.team2player2.lastName + " ";
    });

    app.items = data;
}

function onAddGame (data) {
    console.log("addGame successful", data);
    removeEventListener("addGame", onAddGame)

    app.makeToast("Spiel hinzugefügt", data.team1score + " - " + data.team2score, "success")
    fetchGames();
}

function onAddPlayer (data) {
    console.log("addPlayer successful", data);
    removeEventListener("addPlayer", onAddPlayer)
    app.makeToast("Spieler hinzugefügt", data.firstName + " " +data.lastName + " " + data.nickName, "success")
    fetchPlayers()
}

function fetchPlayers () {
    send("fetchPlayers", {});
}

function onFetchPlayers (data) {
    console.log("recieved some players", data);

    data.forEach(element => {
        element.combined = element.firstName + " " + element.lastName + " " + element.nickName;
    })

    app.players = data;
}