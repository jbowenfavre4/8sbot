const EmbedService = require('../services/EmbedService');
const { embedService } = require('../services/EmbedService');

class StatsService {

    constructor() {
        console.log('Stats service created')
    }

    generalStats(jsonList) {

        let length = jsonList.length
        let killmap = this.#countKills(jsonList)
        let deathmap = this.#countDeaths(jsonList)
        let mostKills = this.#getHighestFromMap(killmap, 5)
        let kdMap = this.#getKDs(killmap, deathmap)
        let bestKD = this.#getHighestFromMap(kdMap, 5)

        let embedData = [
            {
                name: "Matches Played",
                value: `${length}`
            },
            {
                name: "Most Kills",
                value:`${this.#mapToString(mostKills)}`
            },
            {
                name: "Best KD",
                value:`${this.#mapToString(bestKD)}`
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

      #mapToString(map) {
        let s = ""
        map.forEach((value, key, map) => {
            // Note: The order of parameters in forEach is (value, key, map)
            let playerData = value.toString().split(',')
            s += `${[...map.keys()].indexOf(key) + 1}. ${playerData[0]}: ${playerData[1]}\n`;
          });
        return s
      }

}

module.exports = StatsService