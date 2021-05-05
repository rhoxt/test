import { app } from "../index.js";
import { addEventListener, send } from "../socket.js";
import { fetchPlayers } from "../logic.js";



export const newPlayer = Vue.component('new-player', {
    data: function () {
      return {
        newPlayerFirstName: "",
        newPlayerLastName: "",
        newPlayerNickName: "",
      }
    },
    template:
    `
    <div id="app2">
        <b-container>
            <b-row>
                <b-col>
                    <label for="newPlayerFirst">New Player</label>
                    <b-form-input id="newPlayerFirst" v-model="newPlayerFirstName" placeholder="First name"></b-form-input>
                    <b-form-input id="newPlayerLast" v-model="newPlayerLastName" placeholder="Last name"></b-form-input>
                    <b-form-input id="newPlayerNickName" v-model="newPlayerNickName" placeholder="Nickname"></b-form-input>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <button v-on:click="addPlayer" id="addPlayer">Add Player</button>
                </b-col>
            </b-row>
        </b-container>
    </div>
    `,
    methods: {
        addPlayer () {
            const data = {
                firstName: this.newPlayerFirstName || "",
                lastName: this.newPlayerLastName || "",
                nickName: this.newPlayerNickName || ""
            };

            send("addPlayer", data);
            addEventListener("addPlayerResult", this.onAddPlayer, this)
        },

        onAddPlayer (data) {
            console.log("addPlayer successful", data);
            removeEventListener("addPlayer", this.onAddPlayer, this)
            app.makeToast("Spieler hinzugefügt", data.firstName + " " +data.lastName + " " + data.nickName, "success")
            fetchPlayers()
        }
    }
});







