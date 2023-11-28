const UtilityService = require("./UtilityService")
const fs = require('fs')
const groups_file = 'src/data/groups.json'

class GroupService {

    constructor() {
        console.log('RegisterService created')
    }

    static getGroups() {
        return JSON.parse(fs.readFileSync(groups_file, 'utf-8'))
    }

    static checkGroupNameExists(name) {
        let found_group = null
        let data = GroupService.getGroups()
        data.forEach(group => {
            if (group.name == name) {
                found_group = group
                return
            }
        })
        if (found_group != null) {
            return true
        } else {
            return false
        }
    }

    static #updateGroups(data) {
        fs.writeFileSync(groups_file, JSON.stringify(data, null, 2), 'utf-8')
    }

    static addGroup(name, authorId) {
        let data = GroupService.getGroups()
        data.push(
            {
                "name": name,
                "creator": authorId,
                "players": [
                    {
                        "id": authorId
                    }
                ]
            }
        )
        GroupService.#updateGroups(data)
    }

    static isOwner(playerId, group_name) {
        let group = GroupService.getGroup(group_name)
        if (group != null) {

            if (group.creator == playerId) {
                return true
            } else {
                return false
            }
        }
    }

    static checkIfPlayerInGroup(name, playerId) {
        let found_player = null
        let group = GroupService.getGroup(name)
        if (group != null) {
            group.players.forEach(player => {
                if (player.id == playerId) {
                    found_player = player
                    return
                }
            })
        }
        return found_player
    }

    static addPlayerToGroup(playerId, group_name) {
        let data = GroupService.getGroups()
        let result = false
        if (!GroupService.checkIfPlayerInGroup(group_name, playerId)) {
            data.forEach(group => {
                if (group.name == group_name) {
                    group.players.push({
                        "id": playerId
                    })
                    result = true
                    return
                }
            })
        }
        GroupService.#updateGroups(data)
        return result
    }

    static getGroup(name) {
        let found_group = null
        let groups = GroupService.getGroups()
        groups.forEach(group => {
            if (group.name == name) {
                found_group = group
                return
            }
        })
        return found_group
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

module.exports = GroupService