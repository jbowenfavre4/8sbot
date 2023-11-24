const EmbedService = require('../services/EmbedService');
const { embedService } = require('../services/EmbedService');

class StatsService {

    constructor() {
        console.log('Stats service created')
    }

    generalStats(jsonList) {
        let winsMap = this.#getPlayerWinsMap(jsonList)
        let lossesMap = this.#getPlayerLossesMap(jsonList)
        let length = jsonList.length
        let killmap = this.#countKills(jsonList)
        let deathmap = this.#countDeaths(jsonList)
        let mostKills = this.#getHighestFromMap(killmap, 5)
        let kdMap = this.#getKDs(killmap, deathmap)
        let bestKD = this.#getHighestFromMap(kdMap, 5)
        let mostWins = this.#getHighestFromMap(winsMap, 5)
        let winrateMap = this.#getWinRates(winsMap, lossesMap)
        let bestWinRate = this.#getHighestFromMap(winrateMap, 5)

        let embedData = [
            {
                name: "Matches Played",
                value: `${length}`
            },
            {
                name: "Most Kills",
                value:`${this.#mapToString(mostKills)}`,
                inline: true
            },
            {
                name: "Best KD",
                value:`${this.#mapToString(bestKD)}`,
                inline: true
            },
            {
                name: "Most Wins",
                value: `${this.#mapToString(mostWins)}`,
                inline: true
            },
            {
                name: "Best Winrate (%)",
                value: `${this.#mapToString(bestWinRate)}`,
                inline: true
            }
        ]

        return EmbedService.getEmbeddedMessage(
            "General Stats", 
            "A list of general stats based on all recorded matches.",
            embedData)
    }

    #countKills(jsonList) {
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
        return kills
    }

    #countDeaths(jsonList) {
        const deaths = new Map([])
        for (let i = 0; i < jsonList.length; i++) {
            let match = jsonList[i]
            for (let i = 0; i < match.winners.length; i++) {
                let player = match.winners[i]
                if (!deaths.has(player.name)) {
                    deaths.set(player.name, 0)
                }
                deaths.set(player.name, (parseInt(deaths.get(player.name)) + parseInt(player.deaths)).toFixed(3))
            }
            for (let i = 0; i < match.losers.length; i++) {
                let player = match.losers[i]
                if (!deaths.has(player.name)) {
                    deaths.set(player.name, 0)
                }
                deaths.set(player.name, (parseInt(deaths.get(player.name)) + parseInt(player.deaths)).toFixed(3))
            }
        }
        return deaths
    }

    #getHighestFromMap(map, i) {
        const entriesArray = Array.from(map.entries());
        entriesArray.sort((a, b) => b[1] - a[1]);
        const topEntries = entriesArray.slice(0, i);
        return topEntries
    }

    #getLowestFromMap(map, i) {
        const entriesArray = Array.from(map.entries());
        entriesArray.sort((a, b) => a[1] - b[1]);
        const bottomEntries = entriesArray.slice(0, i);
        return bottomEntries
    }
    
    #getKDs(killsMap, deathsMap) {
        const kdMap = new Map();
      
        // Iterate through one of the maps (assuming killsMap in this example)
        killsMap.forEach((kills, name) => {
          // Check if the corresponding player exists in the deathsMap
          if (deathsMap.has(name)) {
            const deaths = deathsMap.get(name);
      
            // Calculate the combined value (kills/deaths) and add to the new map
            kdMap.set(name, (parseInt(kills)/parseInt(deaths)).toFixed(3));
          }
        });
        return kdMap;
      }

      #getWinRates(winsMap, lossesMap) {
        const kdMap = new Map();
      
        // Iterate through one of the maps (assuming killsMap in this example)
        winsMap.forEach((wins, name) => {
          // Check if the corresponding player exists in the deathsMap
          if (lossesMap.has(name)) {
            const losses = lossesMap.get(name);
      
            // Calculate the combined value (kills/deaths) and add to the new map
            kdMap.set(name, (100*(parseInt(wins)/(parseInt(losses) + parseInt(wins)))).toFixed(2));
          }
        });
        return kdMap;
      }

      #mapToString(map) {
        let s = ""
        map.forEach((value, key, map) => {
            // Note: The order of parameters in forEach is (value, key, map)
            let playerData = value.toString().split(',')
            s += `${[...map.keys()].indexOf(key) + 1}. ${playerData[0]}: ${playerData[1]}\n`;
          });
        return s
      }

    #getPlayerWinsMap(data) {
        const playerWinsMap = new Map();

        data.forEach(match => {
            match.winners.forEach(winner => {
                let playerName = winner.name;
                if (playerWinsMap.has(playerName)) {
                    playerWinsMap.set(playerName, playerWinsMap.get(playerName) + 1);
                } else {
                    playerWinsMap.set(playerName, 1);
                }
            });
        });
        return playerWinsMap;
    }

    #getPlayerLossesMap(data) {
        const playerLossesMap = new Map();

        data.forEach(match => {
            match.losers.forEach(loser => {
                let playerName = loser.name;
                if (playerLossesMap.has(playerName)) {
                    playerLossesMap.set(playerName, playerLossesMap.get(playerName) + 1);
                } else {
                    playerLossesMap.set(playerName, 1);
                }
            });
        });
        return playerLossesMap;
    }

}

module.exports = StatsService