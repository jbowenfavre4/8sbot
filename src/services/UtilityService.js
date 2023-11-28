const { EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs')
const RegisterService = require('./RegisterService.js');

class UtilityService {

    static getHighestFromMap(inputMap, n) {
        const sortedEntries = [...inputMap.entries()].sort((a, b) => b[1] - a[1]);
        return sortedEntries.slice(0, n);
      }

    static getLowestFromMap(map, i) {
        const entriesArray = Array.from(map.entries());
        entriesArray.sort((a, b) => a[1] - b[1]);
        const bottomEntries = entriesArray.slice(0, i);
        return bottomEntries
    }

    static mapToString(map) {
        let s = ""
        map.forEach((value, key, map) => {
            // Note: The order of parameters in forEach is (value, key, map)
            let playerData = value.toString().split(',')
            s += `${[...map.keys()].indexOf(key) + 1}. ${playerData[0]}: ${playerData[1]}\n`;
          });
        return s
      }

    static searchJSONList(data, property, value) {
        let found = null
        data.forEach(item => {
            try {
                if (item[property] == value) {
                    found = item
                    return
                }
            } catch(e) {
                console.log("error while searching json list: " + e)
                return
            }
        })
        return found
    }

    static getFileContents(file) {
        let data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return data
    }

    static writeFile(data, file) {
        fs.writeFileSync(file, data, 'utf-8');
    }

    static getHighestFromMap(map, i) {
        const entriesArray = Array.from(map.entries());
        entriesArray.sort((a, b) => b[1] - a[1]);
        const topEntries = entriesArray.slice(0, i);
        return topEntries
    }

}

module.exports = UtilityService