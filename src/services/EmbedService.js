const { EmbedBuilder } = require('discord.js');
const path = require('path');
const { maps } = require('../data/maps.js')

class EmbedService {

    static getEmbeddedMessage(title, description, data) {
        
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(title)
            .setAuthor({ name: '8sbot', iconURL: 'https://pbs.twimg.com/media/EK-5nSWWsAAeQLJ?format=jpg&name=240x240'})
	        .setDescription(description)
        
        for (const field of data) {
            if (field.value != undefined && field.value != '') {
                embed.addFields(field)
            }
        }
        return embed
    }   

    static getMatchEmbed(options) {
        let winners = options.getString('winners')
        let losers = options.getString('losers')

        const mapObject = maps.find(map => map.value.toLowerCase() === options.getString('map'));

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Match Added")
            .setAuthor({name: '8sbot', iconURL: 'https://pbs.twimg.com/media/EK-5nSWWsAAeQLJ?format=jpg&name=240x240'})
            .setDescription('Here are the details for the match that was added:')
            .setThumbnail(mapObject.img)

        let winners_text = ''
        let losers_text = ''

        for (let player of winners.split(",")) {
            let playerObj = this.#getPlayerObject(player)
            winners_text += `${playerObj.name}: ${playerObj.kills}/${playerObj.deaths}\n`
        }

        for (let player of losers.split(",")) {
            let playerObj = this.#getPlayerObject(player)
            losers_text += `${playerObj.name}: ${playerObj.kills}/${playerObj.deaths}\n`
        }

        embed.addFields([
            {
                name: "Map",
                value: options.getString('map'),
                inline: true
            },
            {
                name: "Gamemode",
                value: options.getString('gamemode'),
                inline: true
            },
            {
                name: "Score",
                value: `${options.getInteger('winner-score')} - ${options.getInteger('loser-score')}`,
                inline: true
            },
            { name: '\u200b', value: '\u200b' },
            {
                name: "Winners",
                value: winners_text,
                inline: true
            },
            {
                name: "Losers",
                value: losers_text,
                inline: true
            }
            
        ])

        return embed
        
    }

    static #getPlayerObject(playerString) {
        playerString = playerString.split(":")
        return {
            name: playerString[0],
            kills: playerString[1],
            deaths: playerString[2]
        }
    }

}

module.exports = EmbedService