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

    generalStats(gamemode, group) {

        let default_display_count = 5
        
        let matches_list = []
        let gamemode_name = null
        if (group == null || group == "") {
            if (gamemode == "hardpoint" || gamemode == "snd" || gamemode == "control") {
                matches_list = MatchService.getMatches(gamemode)
                gamemode_name = gamemode
            } else {
                matches_list = MatchService.getMatches(null)
            }
        } else {
            default_display_count = null
            if (gamemode == "hardpoint" || gamemode == "snd" || gamemode == "control") {
                matches_list = MatchService.getMatchesByGroup(group, gamemode)
                gamemode_name = gamemode
            } else {
                matches_list = MatchService.getMatchesByGroup(group, null)
            }
        }


        let counted_data = CountService.getAllPlayerStats(matches_list)

        let most_kills_s = ``
        CountService.sortPlayers(counted_data, 'kills', default_display_count).forEach(player => {
            most_kills_s += `${player.kills} - ${RegisterService.getName(player.id)}\n`
        })

        let best_kd_s = ``
        CountService.sortPlayers(counted_data, 'kd', default_display_count).forEach(player => {
            best_kd_s += `${player.kd} - ${RegisterService.getName(player.id)}\n`
        })

        let best_wr_s = ``
        CountService.sortPlayers(counted_data, 'wr', default_display_count).forEach(player => {
            best_wr_s += `${player.wr} - ${RegisterService.getName(player.id)}\n`
        })

        let most_wins_s = ``
        CountService.sortPlayers(counted_data, 'wins', default_display_count).forEach(player => {
            most_wins_s += `${player.wins} - ${RegisterService.getName(player.id)}\n`
        })

        let most_matches_s = ``
        CountService.sortPlayers(counted_data, 'totalMatches', default_display_count).forEach(player => {
            most_matches_s += `${player.totalMatches} - ${RegisterService.getName(player.id)}\n`
        })

        let embedData = [
            {
                name: "Total Matches Recorded",
                value: `${matches_list.length}`
            },
            {
                name: "Top 5 Most Kills",
                value: most_kills_s,
                inline: true
            },
            {
                name: "Top 5 Most Wins",
                value: most_wins_s,
                inline: true
            },
            {
                name: "Top 5 Most Matches",
                value: most_matches_s,
                inline: true                 
            },
            {
                name: "Top 5 Best KDs",
                value: best_kd_s,
                inline: true
            },
            
            {
                name: "Top 5 Best Winrates (%)",
                value: best_wr_s,
                inline: true
            }
        ]

        if (group != null) {
            if (gamemode_name == null) {
                return EmbedService.getEmbeddedMessage(
                    `Stats for group "${group}"`, 
                    "---------- A list of general stats based on all recorded matches. ----------",
                    embedData)
            } else {
                return EmbedService.getEmbeddedMessage(
                    `Stats for group "${group}" in ${gamemode_name}`, 
                    `---------- A list of ${gamemode_name} stats based on all recorded matches. ----------`,
                    embedData)
            }  
        } else {
            if (gamemode_name == null) {
                return EmbedService.getEmbeddedMessage(
                    "General Stats", 
                    "---------- A list of general stats based on all recorded matches. ----------",
                    embedData)
            } else {
                return EmbedService.getEmbeddedMessage(
                    `General Stats for ${gamemode_name}`, 
                    `---------- A list of ${gamemode_name} stats based on all recorded matches. ----------`,
                    embedData)
            }  
        }
         
    }
}

module.exports = StatsService