function addStatsToPlayers(aPlayers, aGames) {

    var aJsPlayers =JSON.parse(JSON.stringify(aPlayers));


    console.log("Wir packen jetzt an player die games")
    aJsPlayers.forEach(aPlayer => {
        aPlayer.wins = 0;
        aPlayer.losses = 0;
        aPlayer.draws = 0;
    })

    console.log("games:", aGames)

    aGames.forEach(game => {
        var aWinners = getWinnersForGame(game);
        var aLosers = getLosersForGame(game);


        if (aWinners.length === 0 && aLosers.length === 0) {
            console.log("draw", game.team1player1, game.team2player1);
            if(game.team1player1 && game.team1player1._id) {
                aJsPlayers.find(oPlayer => oPlayer._id.toString() == game.team1player1._id.toString()).draws++;
            }
            if(game.team1player2 && game.team1player2._id) {
                aJsPlayers.find(oPlayer => oPlayer._id.toString() == game.team1player2._id.toString()).draws++;
            }
            if(game.team2player1 && game.team2player1._id) {
                aJsPlayers.find(oPlayer => oPlayer._id.toString() == game.team2player1._id.toString()).draws++;
            }
            if(game.team2player2 && game.team2player2._id) {
                aJsPlayers.find(oPlayer => oPlayer._id.toString() == game.team2player2._id.toString()).draws++;
            }
        }

        aWinners.forEach(oWinner => {
            if(oWinner && oWinner._id){
                var oPlayerToAdd = aJsPlayers.find(oPlayer => oPlayer._id.toString() == oWinner._id.toString())
                oPlayerToAdd.wins++;
            }

        })

        aLosers.forEach(oLoser => {
            if(oLoser && oLoser._id) {
                aJsPlayers.find(oPlayer => oPlayer._id.toString() == oLoser._id.toString()).losses++
            }
        })

    });

    console.log("players mit record", aJsPlayers)
    return aJsPlayers;
}

function getWinnersForGame(oGame) {

    if(oGame.team1score > oGame.team2score) {
        return [oGame.team1player1, oGame.team1player2];
    }
    if (oGame.team1score < oGame.team2score) {
        return [oGame.team2player1, oGame.team2player2];
    }
    console.log("no winners")
    return [];
}

function getLosersForGame(oGame) {

    if(oGame.team1score < oGame.team2score) {
        return [oGame.team1player1, oGame.team1player2];
    }
    if (oGame.team1score > oGame.team2score) {
        return [oGame.team2player1, oGame.team2player2];
    }
    console.log("no losers")
    return [];
}

module.exports = {
    addStatsToPlayers
}