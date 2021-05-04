const dotenv = require('dotenv');
const mongoose = require('mongoose');

// local .env setup
if (process.env.DB_URL === undefined) {
    dotenv.config();
}

const { Schema } = mongoose;

class _DatabaseManager {
    connect () {
        console.log(process.env.DB_URL);
        mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                globalThis.console.log('Database connected');
                this.loadModel();
            })
            .catch((err) => {
                globalThis.console.log('Error: Database was not able to connect!', err);
            });
    }

    loadModel () {
        const Games = new Schema({
            date: Number,
            team1player1: String,
            team1player2: String,
            team1score: Number,
            team2player1: String,
            team2player2: String,
            team2score: Number
        });
        this.games = mongoose.model('Games', Games);

        const Players = new Schema({
            firstName: String,
            lastName: String,
            nickName: String
        });
        this.players = mongoose.model('Players', Players);
    }

    addGame (data) {
        if (!this.games) {
            return Promise.reject();
        }

        return this.games.create(data);
    }

    fetchGames () {
        if (!this.games) {
            return Promise.resolve([]);
        }
        return this.games.find({});
    }

    addPlayer (data) {
        if (!this.players) {
            return Promise.reject();
        }

        return this.players.create(data);
    }

    fetchPlayers () {
        if (!this.players) {
            return Promise.resolve([]);
        }
        return this.players.find({});
    }
}

const DatabaseManager = new _DatabaseManager();
module.exports = {
    DatabaseManager
};
