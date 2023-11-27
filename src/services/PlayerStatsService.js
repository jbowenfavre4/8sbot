const EmbedService = require('../services/EmbedService');
const { maps } = require('../data/maps.js')
const StatsService = require('../services/StatsService');
const UtilityService = require('./UtilityService');

class PlayerStatsService {

    constructor() {
        console.log('Player stats service created')
    }

    getPlayerStats(player, matches) {
        let winRateByMapMap = this.#getMapWinLoss(player, matches)
        let bestMap = UtilityService.getHighestFromMap(winRateByMapMap, winRateByMapMap.size)
        
        let embed = [
            {
                name: "Best Maps by Winrate (%)",
                value: UtilityService.mapToString(bestMap)
            }
        ]

        return EmbedService.getEmbeddedMessage(
            `Stats for ${player}`,
            `Here are the stats for this player`,
            embed
        )
    }

    #getMapWinLoss(player, matches) {

        const winRates = new Map()
        maps.forEach(map => {
            winRates.set(map.value, {
                wins: 0,
                losses: 0
            })
        })

        matches.forEach(match => {
            match.winners.forEach(name => {
                if (name.name == player) {
                    winRates.set(match.map, {
                        wins: winRates.get(match.map).wins + 1,
                        losses: winRates.get(match.map).losses
                    })
                    return
                }
            })
            match.losers.forEach(name => {
                if (name.name == player) {
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
            transformedMap.set(name, (isNaN(result.wins/(result.wins+result.losses)) ? 'n/a' : result.wins/(result.wins+result.losses)));
        });

        return transformedMap;

    }
    
}

module.exports = PlayerStatsService