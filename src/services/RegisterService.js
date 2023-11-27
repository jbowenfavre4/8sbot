const UtilityService = require("./UtilityService")
const fs = require('fs')
const registered_players_file = 'src/data/registered_players.json'

class RegisterService {

    constructor() {
        console.log('RegisterService created')
    }

    static getRegistry() {
        return JSON.parse(fs.readFileSync(registered_players_file, 'utf-8'))
    }

    #updateRegistry(data) {
        const updatedJsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(registered_players_file, updatedJsonData, 'utf-8');
    }

    checkIfPlayerRegistered(user) {
        let id = user.id
        let data = RegisterService.getRegistry()
        let player = UtilityService.searchJSONList(data, "id", id)
        if (player != null) {
            return true
        }
        else {
            return false
        }
    }

    addPlayer(user) {
        let data = RegisterService.getRegistry()
        data.push(
            {
                "name": user.username,
                "id": user.id,
                "value": user.id
            }
        )
        this.#updateRegistry(data)
    }

    static getName(id) {
        let found_player = null
        let data = this.getRegistry()
        data.forEach(player => {
            if (player.value == id) {
                found_player = player.name
            }
        })
        return found_player
    }

}

module.exports = RegisterService