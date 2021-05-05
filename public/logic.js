import { app } from "./index.js";
import { addEventListener, send } from "./socket.js";


console.log("socket was successfully opened")

addEventListener("fetchGamesResult", onFetchGames)
addEventListener("fetchPlayersResult", onFetchPlayers)
addEventListener("addGameResult", fetchGames)

console.log(app);

fetchGames();


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

export function fetchPlayers () {
    send("fetchPlayers", {});
}

function onFetchPlayers (data) {
    console.log("recieved some players", data);

    data.forEach(element => {
        element.combined = element.firstName + " " + element.lastName + " " + element.nickName;
    })

    app.players = data;
}