/**
 * Created by Luke on 2014-12-03.
 */

Router.configure({
    layoutTemplate: 'layout'
});
Router.map(function () {
    this.route('home', {path: '/'});
    this.route('play', {
        path: '/game/:_id',
        data: function () {
            var game = Games.findOne(this.params._id);

            if (game) {
                game.player = game.players[Meteor.userId()];
                game.yourTurn = game.currentTurn[0] === Meteor.userId();

                var otherId = game.currentTurn[game.yourTurn ? 1 : 0];
                game.otherPlayer = {
                    username: Meteor.users.findOne(otherId).username,
                    table: game.players[otherId].table,
                    health: game.players[otherId].health
                };
                return game;
            }

            return {};
        }
    });
});