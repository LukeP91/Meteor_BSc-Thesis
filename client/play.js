// function otherID(game){
//     return game.currentTurn[ game.currentTurn[0] === Meteor.userId() ? 1 : 0];
// }

Template.card.helpers({
    typeIs: function (type) {
        return this.type === type;
    }
});

Template.hand.events({
    'click .card': function (evt, template) {
        if (template.data.yourTurn) {
            Meteor.call('playCard', template.data._id, Meteor.userId(), this);
        }
    }
});

Template.deck.events({
    'click .deck': function (evt, template) {
        if (template.data.yourTurn) {
            Meteor.call('drawCard', template.data._id, Meteor.userId());
        }
    }
});

Template.opponentTable.events({
    'click .card': function (evt, template) {
        if (template.data.yourTurn) {
            Meteor.call('makeTargetable', template.data._id,  Meteor.userId(),this);
        }
    }
});

Template.playerTable.events({
    'click .card': function (evt, template) {
        if (template.data.yourTurn) {
            Meteor.call('creatureAttack', template.data._id, Meteor.userId(), this);
        }
    }
});