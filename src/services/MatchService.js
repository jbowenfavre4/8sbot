const { match } = require("assert")
const UtilityService = require("./UtilityService")
const fs = require('fs')

const kdo_regex = /^\d+\/\d+\/\d+$/


const match_file = 'src/data/data.json'

class MatchService {

    constructor() {
        console.log('MatchService created')
    }

    static getMatches() {
        return MatchService.#getFileContents(match_file)
    }

    static matchIncludesPlayer(playerId, match) {
        let flag = false
        try {
            match.winners.forEach(player => {
                if (player.id == playerId) {
                    flag = true
                    return
                }
            })
            if (flag == false) {
                match.losers.forEach(player => {
                    if (player.id == playerId) {
                        flag = true
                        return
                    }
                })
            }
            return flag
        } catch(e) {
            return flag
        }
    }

    static getPlayerMatches(playerId) {
        let matches = MatchService.#getFileContents(match_file)
        let player_matches = []
        matches.forEach(match => {
            if (MatchService.matchIncludesPlayer(playerId, match)) {
                player_matches.push(match)
            }
        })
        return player_matches
    }

    static getPlayerMatchesByGamemode(playerId, gamemode) {
        let matches = MatchService.#getFileContents(match_file)
        let player_matches = []
        matches.forEach(match => {
            if (MatchService.matchIncludesPlayer(playerId, match) && match.gamemode == gamemode) {
                player_matches.push(match)
            }
        })
        return player_matches
    }

    static getMatch(id) {
        let found_match = null
        let matches = MatchService.getMatches()
        matches.forEach(match => {
            if (match.match_id == id) {
                found_match = match
                return
            }
        })
        return found_match
    }

    static logMatch(interaction, match_id) {

        let validation = MatchService.#validateMatch(interaction)

        if (validation.length != 0) {
            return validation
        } else {
            MatchService.#addMatchToFile(interaction, match_id)
        }
    }

    static #validateMatch(interaction) {
        let validationIssues = []
        let winnerScore = interaction.options.getInteger('winner-score')
        let loserScore = interaction.options.getInteger('loser-score')
        let stat_strings = [
            interaction.options.getString('w1-kdo'),
            interaction.options.getString('w2-kdo'),
            interaction.options.getString('w3-kdo'),
            interaction.options.getString('w4-kdo'),
            interaction.options.getString('l1-kdo'),
            interaction.options.getString('l2-kdo'),
            interaction.options.getString('l3-kdo'),
            interaction.options.getString('l4-kdo')
        ]

        stat_strings.forEach(s => {
            if (!kdo_regex.test(s)) {
                validationIssues.push(`KDO string '${s}' is not valid.`)
            }
            kdo_regex.lastIndex = 0
        })

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

    static #addMatchToFile(interaction, match_id) {

        let stat_strings = [
            interaction.options.getString('w1-kdo'),
            interaction.options.getString('w2-kdo'),
            interaction.options.getString('w3-kdo'),
            interaction.options.getString('w4-kdo'),
            interaction.options.getString('l1-kdo'),
            interaction.options.getString('l2-kdo'),
            interaction.options.getString('l3-kdo'),
            interaction.options.getString('l4-kdo')
        ]
        
        let jsonData = MatchService.getMatches()

        jsonData.push({
            datetime: new Date(),
            entered_by: interaction.user.id,
            match_id: match_id,
            map: interaction.options.getString('map'),
            gamemode: interaction.options.getString('gamemode'),
            winners: [
                {
                    id: interaction.options.getString('winner1'),
                    kills: parseInt(stat_strings[0].split('/')[0]),
                    deaths: parseInt(stat_strings[0].split('/')[1]),
                    obj: parseInt(stat_strings[0].split('/')[2])
                },
                {
                    id: interaction.options.getString('winner2'),
                    kills: parseInt(stat_strings[1].split('/')[0]),
                    deaths: parseInt(stat_strings[1].split('/')[1]),
                    obj: parseInt(stat_strings[1].split('/')[2])
                },
                {
                    id: interaction.options.getString('winner3'),
                    kills: parseInt(stat_strings[2].split('/')[0]),
                    deaths: parseInt(stat_strings[2].split('/')[1]),
                    obj: parseInt(stat_strings[2].split('/')[2])
                },
                {
                    id: interaction.options.getString('winner4'),
                    kills: parseInt(stat_strings[3].split('/')[0]),
                    deaths: parseInt(stat_strings[3].split('/')[1]),
                    obj: parseInt(stat_strings[3].split('/')[2])
                }
                    
            ],
            losers: [
                {
                    id: interaction.options.getString('loser1'),
                    kills: parseInt(stat_strings[4].split('/')[0]),
                    deaths: parseInt(stat_strings[4].split('/')[1]),
                    obj: parseInt(stat_strings[4].split('/')[2])
                },
                {
                    id: interaction.options.getString('loser2'),
                    kills: parseInt(stat_strings[5].split('/')[0]),
                    deaths: parseInt(stat_strings[5].split('/')[1]),
                    obj: parseInt(stat_strings[5].split('/')[2])
                },
                {
                    id: interaction.options.getString('loser3'),
                    kills: parseInt(stat_strings[6].split('/')[0]),
                    deaths: parseInt(stat_strings[6].split('/')[1]),
                    obj: parseInt(stat_strings[6].split('/')[2])
                },
                {
                    id: interaction.options.getString('loser4'),
                    kills: parseInt(stat_strings[7].split('/')[0]),
                    deaths: parseInt(stat_strings[7].split('/')[1]),
                    obj: parseInt(stat_strings[7].split('/')[2])
                }
            ],
            winner_score: interaction.options.getInteger('winner-score'),
            loser_score: interaction.options.getInteger('loser-score')
        })

        MatchService.#writeFile(jsonData, match_file)
    }

    static #getFileContents(file) {
        let data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return data
    }

    static #writeFile(data, file) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    }

    

}

module.exports = MatchService