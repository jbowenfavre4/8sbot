const UtilityService = require("./UtilityService")
const fs = require('fs')
const registered_players_file = 'src/data/registered_players.json'

class DirectMessageService {

    constructor(client) {
        this.client = client
    }

    sendMessage(userId, message) {
        this.client.users.cache.get(userId).send(message);
    }

}

module.exports = DirectMessageService