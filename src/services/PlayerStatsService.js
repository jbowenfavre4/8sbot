const EmbedService = require('../services/EmbedService');
const { maps } = require('../data/maps.js')
const StatsService = require('../services/StatsService');
const UtilityService = require('./UtilityService');
const MatchService = require('./MatchService');
const RegisterService = require('./RegisterService');
const CountService = require('./CountService');

class PlayerStatsService {

    constructor() {
        console.log('Player stats service created')
    }

    static getPlayerStats(player, gamemode_filter) {
        let matches = []
        
        if (gamemode_filter != null) {
            matches = MatchService.getPlayerMatchesByGamemode(player, gamemode_filter)
        } else {
            matches = MatchService.getPlayerMatches(player)
        }
        let stats = CountService.getOnePlayerStats(matches, player)
        console.log(UtilityService.sortMapByValue(PlayerStatsService.#getMapWinLoss(player, matches)))
        let embed = [
            {
                name: gamemode_filter == null ? "Overall KD" :`KD in ${gamemode_filter}`,
                value: stats.kd.toFixed(5).toString()
            },
            {
                name: gamemode_filter == null ? "Winrate by map (%)" : `Winrate by map in ${gamemode_filter} (%)`,
                value: `${UtilityService.mapToString(UtilityService.sortMapByValue(PlayerStatsService.#getMapWinLoss(player, matches)))}`
            }
        ]

        let obj_text = ''
        if (gamemode_filter != null) {
            if (gamemode_filter == "hardpoint") {
                obj_text = "Average Hill Time"
            } else if (gamemode_filter == "snd") {
                obj_text = "Average Plants"
            } else if (gamemode_filter == "control") {
                obj_text = "Average Captures"
            }
            embed.push({
                name: obj_text,
                value: (stats.obj / stats.totalMatches).toFixed(0).toString()
            })
        }

        return EmbedService.getEmbeddedMessage(
            `Stats for ${RegisterService.getName(player)} ${gamemode_filter == null ? "" : `in ${gamemode_filter}`}`,
            `Here are your stats`,
            embed
        )

    }

    static #getMapWinLoss(player, matches) {

        const winRates = new Map()
        maps.forEach(map => {
            winRates.set(map.value, {
                wins: 0,
                losses: 0
            })
        })

        matches.forEach(match => {
            match.winners.forEach(guy => {
                if (guy.id == player) {
                    winRates.set(match.map, {
                        wins: winRates.get(match.map).wins + 1,
                        losses: winRates.get(match.map).losses
                    })
                    return
                }
            })
            match.losers.forEach(guy => {
                if (guy.id == player) {
                    winRates.set(match.map, {
                        wins: winRates.get(match.map).wins,
                        losses: winRates.get(match.map).losses + 1
                    })
                    return
                }
            })
        })

        const transformedMap = new Map();

        winRates.forEach((result, name) => {
            transformedMap.set(name, (isNaN(result.wins/(result.wins+result.losses)) ? 'n/a' : 100*(result.wins/(result.wins+result.losses))));
        });

        return transformedMap;

    }

}

module.exports = PlayerStatsService