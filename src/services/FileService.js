const fs = require('fs')

const file = 'src/data/data.json'
const players_file = 'src/data/players.json'

const regex = /^\w+:\d+:\d+(,\w+:\d+:\d+)*$/gm

class FileService {

    constructor() {
        console.log('FileService created')
    }

    logMatch(interaction) {

        let validation = this.#validateMatch(interaction)

        if (validation.length != 0) {
            return validation
        } else {
            this.#addMatchToFile(interaction)
        }
    }

    #validateMatch(interaction) {
        let validationIssues = []
        let winners = interaction.options.getString('winners')
        let losers = interaction.options.getString('losers')
        let winnerScore = interaction.options.getInteger('winner-score')
        let loserScore = interaction.options.getInteger('loser-score')
        
        if (!regex.test(winners)) {
            validationIssues.push('Winners string was invalid.')
        }

        regex.lastIndex = 0

        if (!regex.test(losers)) {
            validationIssues.push('Losers string was invalid')
        }

        regex.lastIndex = 0

        if (winnerScore < 0) {
            validationIssues.push('winner-score is invalid')
        }

        if (loserScore < 0) {
            validationIssues.push('loser-score is invalid')
        }

        if (loserScore >= winnerScore) {
            validationIssues.push('loser-score cannot be greater than winner-score. ')
        }

        if (!this.#allPlayersExist(winners)) {
            validationIssues.push('One of the winners has not been added yet. Please use /add to add them and try again.')
        }

        if (!this.#allPlayersExist(losers)) {
            validationIssues.push('One of the losers has not been added yet. Please use /add to add them and try again.')
        }

        return validationIssues;
    }

    addPlayer(name) {
        let validationIssues = []
        if (this.#onePlayerExists(name)) {
            validationIssues.push('Player already exists.')
            return validationIssues
        } else {
            this.#addPlayerToFile(name)
        }
    }

    #addPlayerToFile(name) {
        let existingPlayers = this.#getFileContents(players_file)
        existingPlayers.push({
            name: name
        })

        this.#writeFileContents(existingPlayers, players_file)
    }

    #addMatchToFile(interaction) {
        
        let jsonData = this.#getFileContents(file)

        jsonData.push({
            map: interaction.options.getString('map'),
            gamemode: interaction.options.getString('gamemode'),
            winners: this.#parseTeamString(interaction.options.getString('winners')),
            losers: this.#parseTeamString(interaction.options.getString('losers')),
            winner_score: interaction.options.getInteger('winner-score'),
            loser_score: interaction.options.getInteger('loser-score')
        })

        this.#writeFileContents(jsonData, file)
    }

    getMatchFileData() {
        return this.#getFileContents(file)
    }

    getPlayerFileData() {
        return this.#getFileContents(players_file)
    }

    #getFileContents(filename) {
        let data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
        return data
    }

    #writeFileContents(objs, filename) {
        const updatedJsonData = JSON.stringify(objs, null, 2);
        fs.writeFileSync(filename, updatedJsonData, 'utf-8');
    }

    #parseTeamString(s) {
        let obj = []
        let players = s.split(',')
        for (let player of players) {
            let player_split = player.split(':')
            obj.push({
                name: player_split[0],
                kills: player_split[1],
                deaths: player_split[2]
            })
        }
        return obj
    }

    #allPlayersExist(s) {
        let players = s.split(',')
        let existingPlayers = this.#getFileContents(players_file)
        for (let player of players) {
            let player_split = player.split(':')
            if (!existingPlayers.some(player => player.name === player_split[0])) {
                return false;
            }
        }
        return true
    }

    #onePlayerExists(name) {
        let existingPlayers = this.getPlayerFileData()
        const playerExists = existingPlayers.some(player => player.name === name);
        return playerExists;
    }

    getPlayerMatches(name) {
        let matches = []

        let matchData = this.getMatchFileData()
        matchData.forEach(match => {
            match.winners.forEach(player => {
                if (player.name == name) {
                    matches.push(match)
                    return
                }
            })
            match.losers.forEach(player => {
                if (player.name == name) {
                    matches.push(match)
                    return
                }
            })
        })
        return matches
    }

}

module.exports = FileService