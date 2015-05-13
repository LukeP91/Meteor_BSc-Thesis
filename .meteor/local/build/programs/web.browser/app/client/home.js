(function(){function otherID(game) {
    return game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0];
}

Template.gameList.helpers({
    games: function () {
        return Games.find({inProgress: true}).map(function (game) {
            game.otherPlayer = Meteor.users.findOne(otherID(game)).username;
            game.started = moment(game.started).fromNow();
            return game;
        });
    }
});

Template.userList.helpers({
    users: function () {
        var myId = Meteor.userId(),
            notAvailablePlayers = [myId];

        Games.find({inProgress: true}).forEach(function (game) {
            notAvailablePlayers.push(otherID(game));
        });

        return Meteor.users.find({_id: {$not: {$in: notAvailablePlayers}}});
    }
});

Template.userItem.events({
    'click button': function (evt, template) {
        evt.preventDefault();
        Meteor.call('createGame', template.data._id);
    }
});


})();
