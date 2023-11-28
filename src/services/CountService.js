

class CountService {

    static getAllPlayerStats(matches) {
        const playerStats = {}
        matches.forEach((match) => {
            match.winners.forEach((player) => {
                CountService.#updateStats(playerStats, player, true)
            })

            match.losers.forEach((player) => {
                CountService.#updateStats(playerStats, player, false)
            })
        })

        Object.entries(playerStats).forEach(([key, value])=> {
            value.kd = parseFloat(( value.deaths == 0 ? value.kills : value.kills / value.deaths ).toFixed(2))
            value.wr = parseFloat(( value.totalMatches == 0 ? 0 : value.wins / value.totalMatches).toFixed(3)*100)
        })

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

    static sortPlayers(playerStats, criteria) {
        const playersArray = Object.entries(playerStats)

        playersArray.sort(([, stats1], [, stats2]) => stats2[criteria] - stats1[criteria])

        return playersArray.map(([playerId, stats]) => ({ id: playerId, ...stats }))
    }

}

module.exports = CountService