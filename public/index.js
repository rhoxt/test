var app = new Vue({
  el: '#app',
  data: {
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
    ],
    team1player1: "",
    team1player2: "",
    team2player1: "",
    team2player2: "",
    team1score: "",
    team2score: "",
    newPlayerFirstName: "",
    newPlayerLastName: "",
    newPlayerNickName: "",
    players: [],
  },

  methods: {
    makeToast(title, message, variant = null, append = null) {
      this.$bvToast.toast(message, {
        autoHideDelay: 5000,
        appendToast: append,
        variant: variant,
        title: title
      })
    }
  }
})

Vue.component('v-select', VueSelect.VueSelect);
