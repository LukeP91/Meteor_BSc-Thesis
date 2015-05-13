(function(){Turns = {};

Turns.gameEnds = function(game){

};

Turns.turnEnd = function (game, id) {
    clearSpells(game);

    game.players[id].action = 3;
    game.currentTurn.unshift(game.currentTurn.pop());
    Turns.turnStart(game, game.currentTurn[0]);
};

Turns.turnStart = function (game, id) {
    var table = game.players[id].table;

    table.forEach(function (card) {
        if (card.type === 'Enchant') {
            card.counters--;
            Turns.checkEnchantType(game, card);
            if (card.counters < 0) game.players[id].table = removeCard(card, table);
        }
    });
};

Turns.drawCard = function (game, playerId) {
    var playerHand = game.players[playerId].hand;
    var playerDeck = game.players[playerId].deck;
    game.players[playerId].action--;
    playerHand.push(playerDeck.shift());
};

Turns.attack = function (game, playerId, card) {
    if (card.type === 'Creature') {
        if (Turns.targetable) {
            if (Turns.target.type === 'Creature') {
                Turns.attackCreature(game, playerId, card);
            }
        }
        else {
            Turns.attackPlayer(game, card);
        }
        game.players[playerId].action--;
    }
};

Turns.attackCreature = function (game, playerId, card) {
    var damage = card.attack;
    var opponent = game.currentTurn[1];
    var opponentTable = game.players[opponent].table;
    console.log(Turns.target);
    opponentTable.forEach(function (card) {
        if (card.type === 'Creature' && card.id === Turns.target.id) {
            card.health = card.health - damage;
        }
    });
    Turns.target.health = Turns.target.health - damage;
    if (Turns.target.health <= 0) {
        game.players[opponent].table = removeCard(Turns.target, opponentTable);
        game.players[opponent].pile.push(Turns.target);
    }
    Turns.targetable = false;
};

Turns.attackPlayer = function (game, card) {
    var damage = card.attack;
    var opponent = game.currentTurn[1];
    game.players[opponent].health = game.players[opponent].health - damage;
};

Turns.playCard = function (game, playerId, card) {
    var playerHand = game.players[playerId].hand;
    var playerTable = game.players[playerId].table;
    if (card.type === 'Spell') {
        Turns.checkSpellType(game, card);
    }
    game.players[playerId].action--;
    playerTable.push(card);
    game.players[playerId].hand = removeCard(card, playerHand);
};

Turns.checkPlayedType = function (game, card) {
    if (card.type === 'Spell') {
        Turns.checkSpellType(game, card);
    }
};

Turns.checkSpellType = function (game, card) {
    if (card.gameType === 'damage') {
        Turns.damageSpellPlayed(game, card);
    }
    if (card.gameType === 'destroy') {
        Turns.destroySpellPlayed(game, card);
    }
    if (card.gameType === 'heal') {
        Turns.healSpellPlayed(game, card);
    }
};

Turns.damageSpellPlayed = function (game, card) {
    var damage = card.effect;
    var opponent = game.currentTurn[1];
    game.players[opponent].health = game.players[opponent].health - damage;
};

Turns.destroySpellPlayed = function (game, card) {
    var opponent = game.currentTurn[1];
    var table = game.players[opponent].table;
    if (Turns.targetable && Turns.target.type === 'Creature') {
        game.players[opponent].table = removeCard(Turns.target, table);
        game.players[opponent].pile.push(Turns.target);
        Turns.targetable = false;
    }
};

Turns.healSpellPlayed = function (game, card) {
    var heal = card.effect;
    var player = game.currentTurn[1];
    if ((game.players[player].health + heal) < 21) {
        game.players[player].health = game.players[player].health + heal;
    }
    else {
        game.players[player].health = 20;
    }
};

Turns.checkEnchantType = function (game, card) {
    if (card.gameType === 'draw') {
        Turns.drawEnchant(game, card);
    }
    if (card.gameType === 'heal') {
        Turns.healEnchant(game, card);
    }
    if (card.gameType === 'damage') {
        Turns.damageEnchant(game, card);
    }
};

Turns.drawEnchant = function (game, card) {
    var playerId = game.currentTurn[0];
    var playerHand = game.players[playerId].hand;
    var playerDeck = game.players[playerId].deck;
    playerHand.push(playerDeck.shift());
};

Turns.healEnchant = function (game, card) {
    var heal = card.effect;
    var player = game.currentTurn[0];
    if ((game.players[player].health + heal) < 21) {
        game.players[player].health = game.players[player].health + heal;
    }
    else {
        game.players[player].health = 20;
    }
};

Turns.damageEnchant = function (game, card) {
    var damage = card.effect;
    var opponent = game.currentTurn[1];
    game.players[opponent].health = game.players[opponent].health - damage;
};

Turns.setTargetable = function (game, card) {
    Turns.target = card;
    Turns.targetable = true;
    console.log("set Targetable ");
    console.log(Turns.target);
};

function removeCard(card, set) {
    return set.filter(function (setCard) {
        return !matchCard(card, setCard);
    });
}

function matchCard(a, b) {
    return a.name === b.name && a.id === b.id;
}

function removeType(set, type) {
    return set.filter(function (setCard) {
        return !matchType(setCard, type);
    });
}

function addType(setFrom, setTo, type) {
    setFrom.forEach(function (card) {
        if (card.type === type) {
            setTo.push(card);
        }
    });
}

function matchType(card, type) {
    return card.type === type;
}

function otherID(game) {
    return game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0];
}

function clearSpells(game) {
    var opponent = game.currentTurn[1];
    var opponentTable = game.players[opponent].table;

    addType(opponentTable, game.players[opponent].pile, 'Spell');
    game.players[opponent].table = removeType(opponentTable, 'Spell');
}

})();
