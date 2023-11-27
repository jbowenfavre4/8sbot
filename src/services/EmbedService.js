const { EmbedBuilder } = require('discord.js');
const path = require('path');
const { maps } = require('../data/maps.js');
const RegisterService = require('./RegisterService.js');
const { match } = require('assert');

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

    static getPastMatchEmbed(match) {
        const mapObject = maps.find(map => map.value.toLowerCase() === match.map);

        let winners_text = ''
        let losers_text = ''

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Match Details (id: ${match.match_id})`)
            .setAuthor({name: '8sbot', iconURL: 'https://pbs.twimg.com/media/EK-5nSWWsAAeQLJ?format=jpg&name=240x240'})
            .setDescription(`Here are the details for match ${match.match_id}`)
            .setThumbnail(mapObject.img)

        match.winners.forEach(player => {
            winners_text += `${RegisterService.getName(player.id)}: ${player.kills}/${player.deaths}/${player.obj}\n`
        })

        match.losers.forEach(player => {
            losers_text += `${RegisterService.getName(player.id)}: ${player.kills}/${player.deaths}/${player.obj}\n`
        })

        embed.addFields([
            {
                name: "Map",
                value: match.map,
                inline: true
            },
            {
                name: "Gamemode",
                value: match.gamemode,
                inline: true
            },
            {
                name: "Score",
                value: `${match.winner_score} - ${match.loser_score}`,
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

    static getMatchEmbed(options, match_id) {
        let winner1 = options.getString('winner1')
        let winner2 = options.getString('winner2')
        let winner3 = options.getString('winner3')
        let winner4 = options.getString('winner4')
        let loser1 = options.getString('loser1')
        let loser2 = options.getString('loser2')
        let loser3 = options.getString('loser3')
        let loser4 = options.getString('loser4')
        let winner1stats = options.getString('w1-kdo').split('/')
        let winner2stats = options.getString('w2-kdo').split('/')
        let winner3stats = options.getString('w3-kdo').split('/')
        let winner4stats = options.getString('w4-kdo').split('/')
        let loser1stats = options.getString('l1-kdo').split('/')
        let loser2stats = options.getString('l2-kdo').split('/')
        let loser3stats = options.getString('l3-kdo').split('/')
        let loser4stats = options.getString('l4-kdo').split('/')

        let winner_objs = []
        let loser_objs = []

        winner_objs.push(this.#getPlayerObjectWithId(winner1, winner1stats))
        winner_objs.push(this.#getPlayerObjectWithId(winner2, winner2stats))
        winner_objs.push(this.#getPlayerObjectWithId(winner3, winner3stats))
        winner_objs.push(this.#getPlayerObjectWithId(winner4, winner4stats))
        loser_objs.push(this.#getPlayerObjectWithId(loser1, loser1stats))
        loser_objs.push(this.#getPlayerObjectWithId(loser2, loser2stats))
        loser_objs.push(this.#getPlayerObjectWithId(loser3, loser3stats))
        loser_objs.push(this.#getPlayerObjectWithId(loser4, loser4stats))

        const mapObject = maps.find(map => map.value.toLowerCase() === options.getString('map'));

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Match Added (id: ${match_id})`)
            .setAuthor({name: '8sbot', iconURL: 'https://pbs.twimg.com/media/EK-5nSWWsAAeQLJ?format=jpg&name=240x240'})
            .setDescription('Here are the details for the match that was added:')
            .setThumbnail(mapObject.img)

        let winners_text = ''
        let losers_text = ''

        winner_objs.forEach(player => {
            winners_text += `${player.name}: ${player.kills}/${player.deaths}/${player.obj}\n`
        })

        loser_objs.forEach(player => {
            losers_text += `${player.name}: ${player.kills}/${player.deaths}/${player.obj}\n`
        })

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

    static #getPlayerObjectWithId(id, statsList) {
        return {
            name: RegisterService.getName(id),
            kills: statsList[0],
            deaths: statsList[1],
            obj: statsList[2]
        }
    }

}

module.exports = EmbedService