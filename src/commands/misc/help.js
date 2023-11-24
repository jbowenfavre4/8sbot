const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const EmbedService = require('../../services/EmbedService.js');

const help_file = "src/data/help.txt"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays help message'),
	async execute(interaction) {

        let text = fs.readFileSync(help_file, 'utf8')
        
        await interaction.reply(text)
    }

}

