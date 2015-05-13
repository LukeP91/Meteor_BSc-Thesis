(function(){Games = new Meteor.Collection('games');

if (Meteor.isServer) {
    Meteor.publish('games', function () {
        return Games.find({
            currentTurn: this.userId
        });
    });

    Meteor.publish('users', function () {
        return Meteor.users.find();
    });
}

if (Meteor.isClient) {
    Meteor.subscribe('games');
    Meteor.subscribe('users');
}

function otherID(game) {
    return game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0];
}

Meteor.methods({
    createGame: function (oponentId) {
        var game = GameFactory.createGame([Meteor.userId(), oponentId]);
        Games.insert(game);
    },

    playCard: function (gameId, playerId, card) {
        var game = Games.findOne(gameId);
        var opponentId = otherID(game);
        if (game.currentTurn[0] !== playerId) return;
        Turns.playCard(game, playerId, card);
        if (game.players[playerId].health === 0 || game.players[opponentId].health === 0) Turns.gameEnds(game);
        if (game.players[playerId].action === 0) Turns.turnEnd(game, playerId);
        Games.update(gameId, game);
    },

    drawCard: function (gameId, playerId) {
        var game = Games.findOne(gameId);
        if (game.currentTurn[0] !== playerId || game.players[playerId].deck.length === 0) return;
        Turns.drawCard(game, playerId);
        if (game.players[playerId].deck.length === 0) Turns.gameEnds(game);
        if (game.players[playerId].action === 0) Turns.turnEnd(game, playerId);
        Games.update(gameId, game);
    },

    makeTargetable: function (gameId, playerId, card) {
        var game = Games.findOne(gameId);
        if (game.currentTurn[0] !== playerId) return;
        Turns.setTargetable(game, card);
        Games.update(gameId, game);
    },

    creatureAttack: function (gameId, playerId, card) {
        var game = Games.findOne(gameId);
        var opponentId = otherID(game);
        if (game.currentTurn[0] !== playerId) return;
        Turns.attack(game, playerId, card);
        if (game.players[playerId].health === 0 || game.players[opponentId].health === 0) Turns.gameEnds(game);
        if (game.players[playerId].action === 0) Turns.turnEnd(game, playerId);
        Games.update(gameId, game);

    }
});

})();
