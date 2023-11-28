const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('general')
		.setDescription('General stats'),
	async execute(interaction) {
        const statsService = this.statsService

        let embed = statsService.generalStats()

        await interaction.reply({ embeds: [embed] })
        
		
	},
};