const { SlashCommandBuilder } = require('discord.js');
const { gamemodes } = require('../../data/gamemodes')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('general')
		.setDescription('General stats')
		.addStringOption(option =>
			option.setName('gamemode')
				.setDescription('Filter by gamemode')
				.setRequired(false)
				.addChoices(...gamemodes)),
		
	async execute(interaction) {
        const statsService = this.statsService
		let embed = ""
		let gamemode_filter = interaction.options.getString('gamemode')
		if (gamemode_filter != null) {
			embed = statsService.generalStats(gamemode_filter)
		} else {
			embed = statsService.generalStats(null)
		}
        
        await interaction.reply({ embeds: [embed] })
        
	},
};