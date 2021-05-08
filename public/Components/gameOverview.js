import { app } from "../index.js";
import { addEventListener, send } from "../socket.js";



export const gameOverview = Vue.component('game-overview', {
    data: function () {
      return {
        items: [],
        fields: [
        {
            key: 'date',
            sortable: true,
            formatter: element => {
            var oDate = new Date(element)
            return oDate.getDate() + "." +oDate.getMonth() + "." +oDate.getFullYear();
            }

        },
        {
            key: 'team1player1Formatted',
            sortable: false,
            label: "Team 1 Spieler 1"
        },
        {
            key: 'team1player2Formatted',
            sortable: false,
            label: "Team 1 Spieler 2"
        },
        {
            key: 'team2player1Formatted',
            sortable: false,
            label: "Team 2 Spieler 1"
        },
        {
            key: 'team2player2Formatted',
            sortable: false,
            label: "Team 2 Spieler 2"
        },
        {
            key: 'result',
            sortable: false,
            label: "Ergebnis"
        }
        ]
      }
    },
    template:
        `
        <b-container>
            <b-table sort-by = "date" sort-desc ="true" sticky-header = "true" striped hover :items="items" :fields="fields"></b-table>
        </b-container>
        `,
        created: function() {
            addEventListener("fetchGamesResult", this.onFetchGames, this)
            addEventListener("addGameResult", this.fetchGames, this)
            this.fetchGames();
        },
    methods: {
        fetchGames () {
            send("fetchGames", {});
        },
        onFetchGames (data) {
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

            this.items = data;
        },
    }
});







