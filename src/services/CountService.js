

class CountService {

    static getAllPlayerStats(matches, gamemode) {
        const playerStats = {}

        if (gamemode != null) {
            matches.forEach((match) => {
                if (match.gamemode == gamemode) {
                    match.winners.forEach((player) => {
                        CountService.#updateStats(playerStats, player, true)
                    })
        
                    match.losers.forEach((player) => {
                        CountService.#updateStats(playerStats, player, false)
                    })
                }
            })
    
            Object.entries(playerStats).forEach(([key, value])=> {
                value.kd = parseFloat(( value.deaths == 0 ? value.kills : value.kills / value.deaths )).toFixed(2)
                value.wr = parseFloat(( value.totalMatches == 0 ? 0 : value.wins / value.totalMatches)*100).toFixed(1)
            })
        } else {
            matches.forEach((match) => {
                match.winners.forEach((player) => {
                    CountService.#updateStats(playerStats, player, true)
                })
    
                match.losers.forEach((player) => {
                    CountService.#updateStats(playerStats, player, false)
                })
            })
    
            Object.entries(playerStats).forEach(([key, value])=> {
                value.kd = parseFloat(( value.deaths == 0 ? value.kills : value.kills / value.deaths )).toFixed(2)
                value.wr = parseFloat(( value.totalMatches == 0 ? 0 : value.wins / value.totalMatches)*100).toFixed(1)
            })
        }

        

        return playerStats
    }

    static getOnePlayerStats(matches, playerId, gamemode) {
        const playerStats = {
            kills: 0,
            deaths: 0,
            totalMatches: 0,
            wins: 0,
            losses: 0,
            obj: 0
        }
        if (gamemode == null) {
            matches.forEach(match => {
                match.winners.forEach(player => {
                    if (player.id == playerId) {
                        playerStats.kills += player.kills
                        playerStats.deaths += player.deaths
                        playerStats.totalMatches = playerStats.totalMatches + 1
                        playerStats.wins = playerStats.wins + 1
                        playerStats.obj = playerStats.obj += player.obj
                    }
                })
                match.losers.forEach(player => {
                    if (player.id == playerId) {
                        playerStats.kills += player.kills
                        playerStats.deaths += player.deaths
                        playerStats.totalMatches = playerStats.totalMatches + 1
                        playerStats.losses = playerStats.losses + 1
                        playerStats.obj = playerStats.obj += player.obj
                    }
                })
            })
        } else {
            matches.forEach(match => {
                if (match.gamemode == gamemode) {
                    match.winners.forEach(player => {
                        if (player.id == playerId) {
                            playerStats.kills += player.kills
                            playerStats.deaths += player.deaths
                            playerStats.totalMatches = playerStats.totalMatches + 1
                            playerStats.wins = playerStats.wins + 1
                            playerStats.obj = playerStats.obj += player.obj
                        }
                    })
                    match.losers.forEach(player => {
                        if (player.id == playerId) {
                            playerStats.kills += player.kills
                            playerStats.deaths += player.deaths
                            playerStats.totalMatches = playerStats.totalMatches + 1
                            playerStats.losses = playerStats.losses + 1
                            playerStats.obj = playerStats.obj += player.obj
                        }
                    })
                }
                
            })
        }

        playerStats.kd = playerStats.kills / (playerStats.deaths == 0 ? 1 : playerStats.deaths)
        playerStats.wr = playerStats.wins / (playerStats.totalMatches == 0 ? 1 : playerStats.totalMatches)
        return playerStats
    }

    static #updateStats(playerStats, player, isWinner) {
        const playerId = player.id

        if (!playerStats[playerId]) {
            playerStats[playerId] = {
                kills: 0,
                deaths: 0,
                obj: 0,
                wins: 0,
                losses: 0,
                totalMatches: 0
            }
        }

        playerStats[playerId].kills += player.kills
        playerStats[playerId].deaths += player.deaths
        playerStats[playerId].obj += player.obj
        playerStats[playerId].totalMatches += 1

        if (isWinner) {
            playerStats[playerId].wins += 1
        } else {
            playerStats[playerId].losses += 1
        }

    }

    static sortPlayers(playerStats, criteria, count) {
        const playersArray = Object.entries(playerStats)

        playersArray.sort(([, stats1], [, stats2]) => stats2[criteria] - stats1[criteria])

        return playersArray.slice(0, count).map(([playerId, stats]) => ({ id: playerId, ...stats }))
    }

}

module.exports = CountService