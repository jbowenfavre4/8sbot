const fs = require('fs')

const file = 'data.json'

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

        return validationIssues;
    }

    #addMatchToFile(interaction) {
        
        let jsonData = this.getFileContents()

        jsonData.push({
            map: interaction.options.getString('map'),
            gamemode: interaction.options.getString('gamemode'),
            winners: this.#parseTeamString(interaction.options.getString('winners')),
            losers: this.#parseTeamString(interaction.options.getString('losers')),
            winner_score: interaction.options.getInteger('winner-score'),
            loser_score: interaction.options.getInteger('loser-score')
        })

        this.#writeFileContents(jsonData)
    }

    getFileContents() {
        let data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return data
    }

    #writeFileContents(objs) {
        const updatedJsonData = JSON.stringify(objs, null, 2);
        fs.writeFileSync(file, updatedJsonData, 'utf-8');
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
}

module.exports = FileService