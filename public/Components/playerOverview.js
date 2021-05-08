import { addEventListener, send } from "../socket.js";



export const playerOverview = Vue.component('player-overview', {
    data: function () {
      return {
        items: [],
        fields: [
            {
                key: 'firstName',
                sortable: false,
                label: "Vorname"
            },
            {
                key: 'lastName',
                sortable: false,
                label: "Nachname"
            },
            {
                key: 'nickName',
                sortable: false,
                label: "Nick name"
            },
            {
                key: "wins",
                label: "Siege"
            },
            {
                key: "losses",
                label: "Niederlagen"
            },
            {
                key: "draws",
                label: "Unentschieden"
            }
        ]
      }
    },
    template:
        `
        <b-container>
        player overview
            <b-table sticky-header = "true" striped hover :items="items" :fields="fields"></b-table>
        </b-container>
        `,
        created: function() {
            addEventListener("fetchPlayersWithStatsResult", this.onFetchPlayersWithStats, this)
            this.fetchPlayersWithStats();
        },
    methods: {
        fetchPlayersWithStats () {
            send("fetchPlayersWithStats", {});
        },
        onFetchPlayersWithStats (data) {
            console.log("recieved some players with stats", data);

            this.items = data;
        },
    }
});







