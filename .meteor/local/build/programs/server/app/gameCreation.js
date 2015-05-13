(function(){GameFactory = {};

GameFactory.createGame = function (playerIds) {
    var playersInGame = createPlayers(playerIds);
    GameFactory.dealCardsToPlayer(playersInGame);
    Turns.targetable = false;
    return {
        players: playersInGame,
        currentTurn: playerIds,
        inProgress: true,
        started: new Date()
    };
};

GameFactory.dealCardsToPlayer = function (players) {
    for (var i = 0; i < 5; i++) {
        Object.keys(players).forEach(function (id) {
            players[id].hand.push(players[id].deck.shift());
        });
    }
};

function createPlayers(ids) {
    var playerObjects = {};

    ids.forEach(function (id) {
        var cardDeck = createDeck();
        playerObjects[id] = {
            deck: cardDeck,
            hand: [],
            pile: [],
            table: [],
            health: 20,
            action: 3
        };
    });
    return playerObjects;
}

function createDeck() {
    var cards = [];
    for (var i = 0; i < 4; i++) {
        cards.push({
            id: i,
            type: 'Creature',
            gameType: 'none',
            name: 'Goblin',
            attack: 1,
            health: 2
        });
        cards.push({
            id: i,
            type: 'Creature',
            gameType: 'none',
            name: 'Orc',
            attack: 2,
            health: 3
        });
        cards.push({
            id: i,
            type: 'Creature',
            gameType: 'none',
            name: 'Wolf',
            attack: 1,
            health: 1
        });
        cards.push({
            id: i,
            type: 'Creature',
            gameType: 'none',
            name: 'Troll',
            attack: 3,
            health: 5
        });
        cards.push({
            id: i,
            type: 'Spell',
            gameType: 'damage',
            name: 'Fireball',
            effectText: ' Deals 2 damage to oponnent.',
            effect: 2
        });
        cards.push({
            id: i,
            type: 'Spell',
            gameType: 'destroy',
            name: 'Execute',
            effectText: ' Target creature: Destroys it.',
        });
        cards.push({
            id: i,
            type: 'Spell',
            gameType: 'heal',
            name: 'Holy Light',
            effectText: ' Heals player for 2 hp.',
            effect: 2
        });
        cards.push({
            id: i,
            type: 'Enchant',
            gameType: 'draw',
            name: 'Book of Elya',
            effectText: ' Enter game with 2 counters. At the beginning of each turn remove one counter. Draw a card.',
            effect: 1,
            counters: 2
        });
        cards.push({
            id: i,
            type: 'Enchant',
            gameType: 'heal',
            name: 'Blessing of Gods',
            effectText: ' Enter game with 4 counters. At the beginning of each turn remove one counter. Heal player for 2 health.',
            effect: 2,
            counters: 4
        });
        cards.push({
            id: i,
            type: 'Enchant',
            gameType: 'damage',
            name: 'Fire Totem',
            effectText: ' Enter game with 2 counters. At the beginning of each turn remove one counter. Deals 2 damage to opponent.',
            effect: 2,
            counters: 2
        });
    }
    return _.shuffle(cards);
}

})();
