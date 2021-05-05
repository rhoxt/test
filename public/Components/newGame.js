import { app } from "../index.js";
import { addEventListener, send } from "../socket.js";



export const newGame = Vue.component('new-game', {
    data: function () {
      return {
        team1player1: "",
        team1player2: "",
        team2player1: "",
        team2player2: "",
        team1score: "",
        team2score: "",
        players: []
      }
    },
    template:
        `
        <b-container>
            <b-row>
                <b-col>
                    <label for="team1player1">Team 1:</label>
                    <v-select id="team1player1" v-model="team1player1" label="combined" key="_id" :options="players"></v-select>
                    <v-select id="team1player2" v-model="team1player2" label="combined" key="_id" :options="players"></v-select>

                    <b-form-input id="team1score" type="number" v-model="team1score" placeholder="Becher übrig Team 1"></b-form-input>
                </b-col>
                <b-col>
                    <label for="team2player1">Team 2:</label>
                    <v-select id="team2player1" v-model="team2player1" label="combined" key="_id" :options="players"></v-select>
                    <v-select id="team2player2" v-model="team2player2" label="combined" key="_id" :options="players"></v-select>

                    <b-form-input id="team2score" type="number" v-model="team2score" placeholder="Becher übrig Team 2"></b-form-input>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <button v-on:click="addGame" id="addGame">AddGame</button>
                </b-col>
            </b-row>
        </b-container>
        `,
        created: function() {
            addEventListener("fetchPlayersResult", this.onFetchPlayers, this)
            this.fetchPlayers();
        },
    methods: {
        addGame () {
            var team1player1 = this.team1player1._id;
            var team1player2 = this.team1player2._id;
            var team2player1 = this.team2player1._id;
            var team2player2 = this.team2player2._id;

            const data = {
                date: Date.now(),
                team1player1:  team1player1 || "team1player1",
                team1player2: team1player2 || "team1player2",
                team1score: app.team1score || 0,
                team2player1: team2player1 || "team2player1",
                team2player2: team2player2|| "team2player2",
                team2score: app.team2score || 0,
            };

            console.log(data);

            send("addGame", data);
            addEventListener("addGameResult", this.onAddGame, this)
        },

        onAddGame (data) {
            console.log("addGame successful", data);
            removeEventListener("addGame", this.onAddGame, this)

            app.makeToast("Spiel hinzugefügt", data.team1score + " - " + data.team2score, "success")
        },

        fetchPlayers () {
            send("fetchPlayers", {});
        },

        onFetchPlayers (data) {
            console.log("recieved some players", data);

            data.forEach(element => {
                element.combined = element.firstName + " " + element.lastName + " " + element.nickName;
            })

            this.players = data;
        }
    }
});







