const EmbedService = require('../services/EmbedService');
const { maps } = require('../data/maps.js')
const StatsService = require('../services/StatsService');
const UtilityService = require('./UtilityService');
const MatchService = require('./MatchService');
const RegisterService = require('./RegisterService');

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
        let statsObj = PlayerStatsService.#getPlayerStatsObj(player, matches)
        
        let mapWinRates = UtilityService.getHighestFromMap(PlayerStatsService.#getMapWinLoss(player, matches), 10)

        let kd = 0
        let obj = 0
        let obj_text = ''

        if (gamemode_filter != null) {
            if (gamemode_filter == "hardpoint") {
                kd = statsObj.hardpoint.kills / (statsObj.hardpoint.deaths == 0 ? 1 : statsObj.hardpoint.deaths)
                obj_text = 'Average Hill Time'
                obj = statsObj.hardpoint.obj / statsObj.hardpoint.wins + statsObj.hardpoint.losses
            } else if (gamemode_filter == "snd") {
                kd = statsObj.snd.kills / (statsObj.snd.deaths == 0 ? 1 : statsObj.snd.deaths)
                obj_text = 'Average Plants'
                obj = statsObj.snd.obj / statsObj.snd.wins + statsObj.snd.losses
            } else if (gamemode_filter == "control") {
                kd = statsObj.control.kills / (statsObj.control.deaths == 0 ? 1 : statsObj.control.deaths)
                obj_text = 'Average Captures'
                obj = statsObj.control.obj / statsObj.control.wins + statsObj.control.losses
            }
        } else {
            kd = statsObj.total_kills / (statsObj.total_deaths == 0 ? 1 : statsObj.total_deaths)
            
        }
        
        let embed = [
            {
                name: gamemode_filter == null ? "Overall KD" :`KD in ${gamemode_filter}`,
                value: kd.toString()
            },
            {
                name: gamemode_filter == null ? "Winrate by map" : `Winrate by map in ${gamemode_filter}`,
                value: `${UtilityService.mapToString(mapWinRates)}`
            }
        ]

        if (gamemode_filter != null) {
            embed.push({
                name: obj_text,
                value: obj.toString()
            })
        }

        return EmbedService.getEmbeddedMessage(
            `Stats for ${RegisterService.getName(player)}`,
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

    static #getPlayerStatsObj(player, matches) {
        let kd = {
            hardpoint: {
                kills: 0,
                deaths: 0,
                wins: 0,
                losses: 0,
                obj: 0
            },
            snd: {
                kills: 0,
                deaths: 0,
                wins: 0,
                losses: 0,
                obj: 0
            },
            control: {
                kills: 0,
                deaths: 0,
                wins: 0,
                losses: 0,
                obj: 0
            },
            total_kills: 0,
            total_deaths: 0,
            total_obj: 0,
            total_wins: 0,
            total_losses: 0
        }
        matches.forEach(match => {
            match.winners.forEach(guy => {
                if (guy.id == player) {
                    if (match.gamemode == "snd") {
                        kd.snd.wins = kd.snd.wins + 1
                        kd.snd.kills = kd.snd.kills + guy.kills
                        kd.snd.deaths = kd.snd.deaths + guy.deaths
                        kd.snd.obj = kd.snd.obj + guy.obj
                    } else if (match.gamemode == "hardpoint") {
                        kd.hardpoint.wins = kd.hardpoint.wins + 1
                        kd.hardpoint.kills = kd.hardpoint.kills + guy.kills
                        kd.hardpoint.deaths = kd.hardpoint.deaths + guy.deaths
                        kd.hardpoint.obj = kd.hardpoint.obj + guy.obj
                    } else if (match.gamemode == "control") {
                        kd.control.wins = kd.control.wins + 1
                        kd.control.kills = kd.control.kills + guy.kills
                        kd.control.deaths = kd.control.deaths + guy.deaths
                        kd.control.obj = kd.control.obj + guy.obj
                    }
                    kd.total_kills = kd.total_kills + guy.kills
                    kd.total_deaths = kd.total_deaths + guy.deaths
                    kd.total_obj = kd.total_obj + guy.obj
                    kd.total_wins = kd.total_wins + 1
                }
            })
            match.losers.forEach(guy => {
                if (guy.id == player) {
                    if (match.gamemode == "snd") {
                        kd.snd.losses = kd.snd.losses + 1
                        kd.snd.kills = kd.snd.kills + guy.kills
                        kd.snd.deaths = kd.snd.deaths + guy.deaths
                        kd.snd.obj = kd.snd.obj + guy.obj
                    } else if (match.gamemode == "hardpoint") {
                        kd.hardpoint.losses = kd.hardpoint.losses + 1
                        kd.hardpoint.kills = kd.hardpoint.kills + guy.kills
                        kd.hardpoint.deaths = kd.hardpoint.deaths + guy.deaths
                        kd.hardpoint.obj = kd.hardpoint.obj + guy.obj
                    } else if (match.gamemode == "control") {
                        kd.control.losses = kd.control.losses + 1
                        kd.control.kills = kd.control.kills + guy.kills
                        kd.control.deaths = kd.control.deaths + guy.deaths
                        kd.control.obj = kd.control.obj + guy.obj
                    }
                    kd.total_kills = kd.total_kills + guy.kills
                    kd.total_deaths = kd.total_deaths + guy.deaths
                    kd.total_obj = kd.total_obj + guy.obj
                    kd.total_losses = kd.total_losses + 1
                }
            })
        })
        return kd
    }

}

module.exports = PlayerStatsService