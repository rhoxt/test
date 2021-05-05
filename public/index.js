import {newPlayer} from "./Components/newPlayer.js";
import {newGame} from "./Components/newGame.js";

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/newPlayer', component: newPlayer },
  { path: '/newGame', component: newGame }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

export var app = new Vue({
  router,
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
    ]
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
}).$mount('#app')

Vue.component('v-select', VueSelect.VueSelect);






