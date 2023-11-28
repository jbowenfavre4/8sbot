const EmbedService = require('../services/EmbedService');
const { embedService } = require('../services/EmbedService');
const MatchService = require('./MatchService');
const PlayerStatsService = require('./PlayerStatsService');
const CountService = require('./CountService');
const RegisterService = require('./RegisterService');

class StatsService {

    constructor() {

        this.playerStatsService = PlayerStatsService
        console.log('Stats service created')
    }

    generalStats() {

        let matches_list = MatchService.getMatches()
        let counted_data = CountService.getAllPlayerStats(matches_list)

        let most_kills_s = ``
        CountService.sortPlayers(counted_data, 'kills').forEach(player => {
            most_kills_s += `${player.kills} - ${RegisterService.getName(player.id)}\n`
        })

        let best_kd_s = ``
        CountService.sortPlayers(counted_data, 'kd').forEach(player => {
            best_kd_s += `${player.kd} - ${RegisterService.getName(player.id)}\n`
        })

        let best_wr_s = ``
        CountService.sortPlayers(counted_data, 'wr').forEach(player => {
            best_wr_s += `${player.wr} - ${RegisterService.getName(player.id)}\n`
        })

        let most_wins_s = ``
        CountService.sortPlayers(counted_data, 'wins').forEach(player => {
            most_wins_s += `${player.wins} - ${RegisterService.getName(player.id)}\n`
        })

        let most_matches_s = ``
        CountService.sortPlayers(counted_data, 'totalMatches').forEach(player => {
            most_matches_s += `${player.totalMatches} - ${RegisterService.getName(player.id)}\n`
        })


        console.log(most_kills_s)

        let embedData = [
            {
                name: "Matches Played",
                value: `${matches_list.length}`
            },
            {
                name: "Most Kills",
                value: most_kills_s,
                inline: true
            },
            {
                name: "Most Wins",
                value: most_wins_s,
                inline: true
            },
            {
                name: "Most Matches",
                value: most_matches_s,
                inline: true                 
            },
            {
                name: "Best KD",
                value: best_kd_s,
                inline: true
            },
            
            {
                name: "Best Winrate (%)",
                value: best_wr_s,
                inline: true
            }
        ]

        return EmbedService.getEmbeddedMessage(
            "General Stats", 
            "---------- A list of general stats based on all recorded matches. ----------",
            embedData)
    }

    #countKills(jsonList, players) {
        const kills = new Map([])
        for (let i = 0; i < jsonList.length; i++) {
            let match = jsonList[i]
            for (let i = 0; i < match.winners.length; i++) {
                let player = match.winners[i]
                if (!kills.has(player.name)) {
                    kills.set(player.name, 0)
                }
                kills.set(player.name, parseInt(kills.get(player.name)) + parseInt(player.kills))
            }
            for (let i = 0; i < match.losers.length; i++) {
                let player = match.losers[i]
                if (!kills.has(player.name)) {
                    kills.set(player.name, 0)
                }
                kills.set(player.name, parseInt(kills.get(player.name)) + parseInt(player.kills))
            }
        }

        players.forEach(player => {
            let playerName = player.name
            if (!kills.has(playerName)) {
                kills.set(playerName, 0)
            }
        })

        return kills
    }
}

module.exports = StatsService