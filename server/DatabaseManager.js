const dotenv = require('dotenv');
const mongoose = require('mongoose');

// local .env setup
if (process.env.DB_URL === undefined) {
    dotenv.config();
}

const { Schema } = mongoose;

class _DatabaseManager {
    connect () {
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
            player1: String,
            player2: String,
            scorePlayer1: Number,
            scorePlayer2: Number,
        });
        this.games = mongoose.model('Games', Games);
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
}

const DatabaseManager = new _DatabaseManager();
module.exports = {
    DatabaseManager
};
