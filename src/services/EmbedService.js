const { EmbedBuilder } = require('discord.js');

class EmbedService {

    static getEmbeddedMessage(title, description, data) {
        
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(title)
            .setAuthor({ name: '8sbot', iconURL: 'https://i.imgur.com/AfFp7pu.png'})
	        .setDescription(description)
        
        for (const field of data) {
            if (field.value != undefined && field.value != '') {
                embed.addFields(field)
            }
        }
        return embed
    }   

}

module.exports = EmbedService